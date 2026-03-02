from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Float, ForeignKey, Boolean
from datetime import datetime
from database import Base


class Patient(Base):
    __tablename__ = "patients"

    patient_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    phone = Column(String(15), unique=True, nullable=True)
    password = Column(String(255), nullable=False, default="")
    google_id = Column(String(100), unique=True, nullable=True)


class OTPRecord(Base):
    __tablename__ = "otp_records"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(15), nullable=False)
    otp_code = Column(String(6), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_used = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)


class HealthVitals(Base):
    __tablename__ = "health_vitals"

    vitals_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"), nullable=False)
    heart_rate = Column(Float, nullable=True)
    systolic_bp = Column(Float, nullable=True)
    diastolic_bp = Column(Float, nullable=True)
    blood_glucose = Column(Float, nullable=True)
    oxygen_saturation = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)


class HealthQuery(Base):
    __tablename__ = "health_queries"

    query_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"), nullable=False)
    category = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(20), default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)


class Appointment(Base):
    __tablename__ = "appointments"

    appt_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"), nullable=False)
    department = Column(String(50), nullable=False)
    preferred_date = Column(Date, nullable=False)
    preferred_time = Column(String(20), nullable=False)
    reason = Column(Text)
    status = Column(String(20), default="Pending")
