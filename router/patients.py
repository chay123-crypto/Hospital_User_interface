import random
import string
from datetime import datetime, timedelta, date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from models import Patient, HealthQuery, Appointment, OTPRecord, HealthVitals
from schemas import (
    PatientLogin, PatientCreate,
    HealthQueryCreate, AppointmentCreate,
    PhoneLoginRequest, OTPVerifyRequest,
    HealthVitalsCreate, HealthVitalsOut,
)
from dependency import get_db

router = APIRouter(prefix="/patient", tags=["Patient"])

# ─── EMAIL / PASSWORD LOGIN ───────────────────────────────────────────────────
@router.post("/login")
def login(data: PatientLogin, db: Session = Depends(get_db)):
    patient = (
        db.query(Patient)
        .filter(Patient.email == data.email)
        .filter(Patient.password == data.password)
        .first()
    )
    if not patient:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"patient_id": patient.patient_id, "name": patient.name}


# ─── GOOGLE OAUTH LOGIN ───────────────────────────────────────────────────────
from pydantic import BaseModel
class GoogleLoginRequest(BaseModel):
    google_id: str
    email: str
    name: str

@router.post("/login/google")
def google_login(data: GoogleLoginRequest, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.google_id == data.google_id).first()

    if not patient:
        patient = db.query(Patient).filter(Patient.email == data.email).first()
        if patient:
            patient.google_id = data.google_id
            db.commit()

    if not patient:
        patient = Patient(
            name=data.name,
            email=data.email,
            google_id=data.google_id,
            password="",
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)

    return {"patient_id": patient.patient_id, "name": patient.name}


# ─── PHONE OTP: REQUEST ───────────────────────────────────────────────────────
@router.post("/login/phone/request-otp")
def request_otp(data: PhoneLoginRequest, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.phone == data.phone).first()
    if not patient:
        raise HTTPException(status_code=404, detail="No account found with this phone number")

    db.query(OTPRecord).filter(
        OTPRecord.phone == data.phone,
        OTPRecord.is_used == False
    ).update({"is_used": True})
    db.commit()

    otp_code = "".join(random.choices(string.digits, k=6))
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    record = OTPRecord(phone=data.phone, otp_code=otp_code, expires_at=expires_at)
    db.add(record)
    db.commit()

    print(f"[DEV] OTP for {data.phone}: {otp_code}")
    return {"message": f"OTP sent to {data.phone}", "otp_dev": otp_code, "expires_in_minutes": 10}


# ─── PHONE OTP: VERIFY ────────────────────────────────────────────────────────
@router.post("/login/phone/verify-otp")
def verify_otp(data: OTPVerifyRequest, db: Session = Depends(get_db)):
    record = (
        db.query(OTPRecord)
        .filter(
            OTPRecord.phone == data.phone,
            OTPRecord.otp_code == data.otp_code,
            OTPRecord.is_used == False,
        )
        .order_by(OTPRecord.created_at.desc())
        .first()
    )
    if not record:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if record.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")

    record.is_used = True
    db.commit()

    patient = db.query(Patient).filter(Patient.phone == data.phone).first()
    return {"patient_id": patient.patient_id, "name": patient.name}


# ─── SIGNUP ───────────────────────────────────────────────────────────────────
@router.post("/signup")
def signup(data: PatientCreate, db: Session = Depends(get_db)):
    if data.email:
        existing = db.query(Patient).filter(Patient.email == data.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
    if data.phone:
        existing = db.query(Patient).filter(Patient.phone == data.phone).first()
        if existing:
            raise HTTPException(status_code=400, detail="Phone number already registered")

    patient = Patient(name=data.name, email=data.email, phone=data.phone, password=data.password)
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return {"patient_id": patient.patient_id, "message": "Account created successfully"}


# ─── DASHBOARD ────────────────────────────────────────────────────────────────
@router.get("/{patient_id}/dashboard")
def dashboard(patient_id: int, db: Session = Depends(get_db)):
    current_today = date.today()
    
    # Latest 5 Queries
    queries = db.query(HealthQuery).filter_by(patient_id=patient_id).order_by(desc(HealthQuery.created_at)).limit(5).all()
    
    # Only Upcoming Appointments for Dashboard (Today or future)
    appts = (
        db.query(Appointment)
        .filter(Appointment.patient_id == patient_id)
        .filter(Appointment.preferred_date >= current_today)
        .order_by(asc(Appointment.preferred_date))
        .all()
    )
    
    latest_vitals = (
        db.query(HealthVitals)
        .filter_by(patient_id=patient_id)
        .order_by(desc(HealthVitals.recorded_at))
        .first()
    )
    
    return {
        "queries": queries, 
        "appointments": appts, 
        "latest_vitals": latest_vitals
    }


# ─── APPOINTMENTS ─────────────────────────────────────────────────────────────
@router.get("/{patient_id}/appointments")
def get_appointments(patient_id: int, filter: str = "all", db: Session = Depends(get_db)):
    current_today = date.today()
    q = db.query(Appointment).filter(Appointment.patient_id == patient_id)
    
    if filter == "upcoming":
        # Appointments for today and onwards
        q = q.filter(Appointment.preferred_date >= current_today).order_by(asc(Appointment.preferred_date))
    elif filter == "past":
        # Appointments before today
        q = q.filter(Appointment.preferred_date < current_today).order_by(desc(Appointment.preferred_date))
    else:
        # All appointments, sorted by most recent first
        q = q.order_by(desc(Appointment.preferred_date))
        
    return q.all()


@router.post("/{patient_id}/appointment")
def request_appointment(patient_id: int, data: AppointmentCreate, db: Session = Depends(get_db)):
    appt = Appointment(
        patient_id=patient_id,
        department=data.department,
        preferred_date=data.preferred_date,
        preferred_time=data.preferred_time,
        reason=data.reason,
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return {"appointment_id": appt.appt_id, "status": appt.status}


# ─── QUERIES ──────────────────────────────────────────────────────────────────
@router.get("/{patient_id}/queries")
def get_queries(patient_id: int, filter: str = "all", db: Session = Depends(get_db)):
    q = db.query(HealthQuery).filter_by(patient_id=patient_id)
    if filter == "pending":
        q = q.filter(HealthQuery.status == "Pending")
    elif filter == "resolved":
        q = q.filter(HealthQuery.status != "Pending")
    return q.order_by(desc(HealthQuery.created_at)).all()


@router.post("/{patient_id}/query")
def submit_query(patient_id: int, data: HealthQueryCreate, db: Session = Depends(get_db)):
    q = HealthQuery(patient_id=patient_id, category=data.category, message=data.message)
    db.add(q)
    db.commit()
    db.refresh(q)
    return {"query_id": q.query_id, "status": q.status}


# ─── VITALS ───────────────────────────────────────────────────────────────────
@router.get("/{patient_id}/vitals", response_model=list[HealthVitalsOut])
def get_vitals(patient_id: int, db: Session = Depends(get_db)):
    return (
        db.query(HealthVitals)
        .filter_by(patient_id=patient_id)
        .order_by(desc(HealthVitals.recorded_at))
        .all()
    )

@router.post("/{patient_id}/vitals", response_model=HealthVitalsOut)
def log_vitals(patient_id: int, data: HealthVitalsCreate, db: Session = Depends(get_db)):
    vitals = HealthVitals(patient_id=patient_id, **data.dict())
    db.add(vitals)
    db.commit()
    db.refresh(vitals)
    return vitals