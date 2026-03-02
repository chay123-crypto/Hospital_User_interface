from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional


class PatientLogin(BaseModel):
    email: EmailStr
    password: str


class PhoneLoginRequest(BaseModel):
    phone: str


class OTPVerifyRequest(BaseModel):
    phone: str
    otp_code: str


class HealthQueryCreate(BaseModel):
    category: str
    message: str


class AppointmentCreate(BaseModel):
    department: str
    preferred_date: date
    preferred_time: str
    reason: str


class PatientCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    password: str


class HealthVitalsCreate(BaseModel):
    heart_rate: Optional[float] = None
    systolic_bp: Optional[float] = None
    diastolic_bp: Optional[float] = None
    blood_glucose: Optional[float] = None
    oxygen_saturation: Optional[float] = None
    temperature: Optional[float] = None
    weight: Optional[float] = None
    notes: Optional[str] = None


class HealthVitalsOut(BaseModel):
    vitals_id: int
    patient_id: int
    heart_rate: Optional[float]
    systolic_bp: Optional[float]
    diastolic_bp: Optional[float]
    blood_glucose: Optional[float]
    oxygen_saturation: Optional[float]
    temperature: Optional[float]
    weight: Optional[float]
    recorded_at: datetime
    notes: Optional[str]

    class Config:
        from_attributes = True
