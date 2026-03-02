from database import engine, SessionLocal

# Just provide engine and a session factory
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()