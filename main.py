from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router.patients import router as patient_router
from database import Base, engine

# Import all models so tables are created
from models import Patient, HealthQuery, Appointment, OTPRecord, HealthVitals

app = FastAPI(title="TetherX Patient Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all tables (including new ones)
Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(patient_router)
