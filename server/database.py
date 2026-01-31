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
    
    # Manager information
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    manager_email = Column(String, nullable=True)  # For email notifications
    is_manager = Column(Boolean, default=False, nullable=False)  # If user is a manager
    
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

# Leave Balance model - Admin controlled
class LeaveBalance(Base):
    __tablename__ = "leave_balance"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    
    # Leave types (in days)
    earned_leave_total = Column(Float, default=21.0)  # Privilege Leave/Annual Leave
    earned_leave_used = Column(Float, default=0.0)
    
    casual_leave_total = Column(Float, default=7.0)  # Casual Leave
    casual_leave_used = Column(Float, default=0.0)
    
    sick_leave_total = Column(Float, default=14.0)  # Sick Leave
    sick_leave_used = Column(Float, default=0.0)
    
    comp_off_total = Column(Float, default=0.0)  # Compensatory Off
    comp_off_used = Column(Float, default=0.0)
    
    # Metadata
    year = Column(Integer, nullable=False)  # Leave balance year
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Leave Request model
class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    leave_type = Column(String, nullable=False)  # earned, casual, sick, comp_off, lop
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    days = Column(Float, nullable=False)  # Total days (can be 0.5 for half day)
    reason = Column(String, nullable=True)
    
    status = Column(String, default="pending")  # pending, approved, rejected
    
    # Manager approval
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    manager_approved_at = Column(DateTime, nullable=True)
    manager_comments = Column(String, nullable=True)
    
    # Admin reference (for old system compatibility)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(String, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Attendance model
class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False)  # present, absent, half_day, leave, holiday, week_off
    check_in = Column(String, nullable=True)  # Time in HH:MM format
    check_out = Column(String, nullable=True)  # Time in HH:MM format
    hours_worked = Column(Float, default=0.0)
    
    leave_type = Column(String, nullable=True)  # If status is leave
    remarks = Column(String, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # Admin who created/uploaded

# Holiday model - Admin controlled
class Holiday(Base):
    __tablename__ = "holidays"
    
    id = Column(Integer, primary_key=True, index=True)
    
    date = Column(Date, nullable=False, unique=True)
    name = Column(String, nullable=False)  # e.g., "Republic Day", "Diwali"
    category = Column(String, nullable=False)  # mandatory, optional, week_off, client_work
    description = Column(String, nullable=True)
    
    # For optional holidays - track who took it
    is_optional = Column(Boolean, default=False)
    
    year = Column(Integer, nullable=False)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

# Optional Holiday Taken - Track which users took optional holidays
class OptionalHolidayTaken(Base):
    __tablename__ = "optional_holidays_taken"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    holiday_id = Column(Integer, ForeignKey("holidays.id"), nullable=False)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)

# Working Saturday - Track when office is open on Saturday for client work
class WorkingSaturday(Base):
    __tablename__ = "working_saturdays"
    
    id = Column(Integer, primary_key=True, index=True)
    
    date = Column(Date, nullable=False, unique=True)
    reason = Column(String, nullable=False)  # e.g., "Client requirement", "Project deadline"
    description = Column(String, nullable=True)
    
    # Comp off settings
    comp_off_eligible = Column(Boolean, default=True)  # If employees get comp off
    
    year = Column(Integer, nullable=False)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)


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
