from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Date, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from config import settings

# Create engine
engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# User model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    must_change_password = Column(Boolean, default=True, nullable=False)
    
    # Admin-controlled fields (employment data)
    role = Column(String, nullable=True)  # e.g., Backend Developer, HR, Analyst
    experience = Column(Integer, nullable=True)  # years of experience
    skills = Column(String, nullable=True)  # comma-separated skills
    
    # User-controlled fields (personal data)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    area_of_interest = Column(String, nullable=True)
    profile_photo = Column(String, nullable=True)  # URL or base64
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Payroll model
class Payroll(Base):
    __tablename__ = "payroll"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Salary components
    basic_salary = Column(Float, nullable=False)
    hra = Column(Float, default=0.0)  # House Rent Allowance
    transport_allowance = Column(Float, default=0.0)
    other_allowances = Column(Float, default=0.0)
    
    # Deductions
    tax = Column(Float, default=0.0)
    provident_fund = Column(Float, default=0.0)
    insurance = Column(Float, default=0.0)
    other_deductions = Column(Float, default=0.0)
    
    # Bonus/Incentives
    bonus = Column(Float, default=0.0)
    
    # Period
    month = Column(String, nullable=False)  # e.g., "January 2026"
    year = Column(Integer, nullable=False)
    
    # Status
    status = Column(String, default="pending")  # pending, processed, paid
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # Admin who created it

# User Activity Log model for Wellness AI
class UserActivityLog(Base):
    __tablename__ = "user_activity_log"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    login_time = Column(DateTime, nullable=True)
    logout_time = Column(DateTime, nullable=True)
    session_duration_minutes = Column(Float, nullable=True)
    activity_type = Column(String, nullable=False)  # dashboard, learning, login, logout
    date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Wellbeing Story model
class WellbeingStory(Base):
    __tablename__ = "wellbeing_story"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    story_text = Column(Text, nullable=False)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Wellbeing Response model
class WellbeingResponse(Base):
    __tablename__ = "wellbeing_response"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    story_id = Column(Integer, ForeignKey("wellbeing_story.id"), nullable=False)
    answers_json = Column(JSON, nullable=False)  # Store answers as JSON
    detected_mood = Column(String, nullable=False)  # CALM, MOTIVATED, STRESSED, OVERWHELMED, DISENGAGED
    mood_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create all tables
def init_db():
    Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
