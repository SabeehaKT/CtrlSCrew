from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional, List
from datetime import datetime, date

# Request schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class AdminUserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    is_admin: Optional[bool] = False
    role: Optional[str] = None
    experience: Optional[int] = None
    skills: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class AdminUserUpdate(BaseModel):
    """Admin can update employment-related fields"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None
    experience: Optional[int] = None
    skills: Optional[str] = None
    is_admin: Optional[bool] = None

class UserProfileUpdate(BaseModel):
    """User can update their own personal fields"""
    phone: Optional[str] = None
    address: Optional[str] = None
    area_of_interest: Optional[str] = None
    profile_photo: Optional[str] = None

# Response schemas
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool
    must_change_password: bool
    role: Optional[str] = None
    experience: Optional[int] = None
    skills: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    area_of_interest: Optional[str] = None
    profile_photo: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Payroll schemas
class PayrollCreate(BaseModel):
    user_id: int
    basic_salary: float
    hra: Optional[float] = 0.0
    transport_allowance: Optional[float] = 0.0
    other_allowances: Optional[float] = 0.0
    tax: Optional[float] = 0.0
    provident_fund: Optional[float] = 0.0
    insurance: Optional[float] = 0.0
    other_deductions: Optional[float] = 0.0
    bonus: Optional[float] = 0.0
    month: str
    year: int
    status: Optional[str] = "pending"

class PayrollUpdate(BaseModel):
    basic_salary: Optional[float] = None
    hra: Optional[float] = None
    transport_allowance: Optional[float] = None
    other_allowances: Optional[float] = None
    tax: Optional[float] = None
    provident_fund: Optional[float] = None
    insurance: Optional[float] = None
    other_deductions: Optional[float] = None
    bonus: Optional[float] = None
    month: Optional[str] = None
    year: Optional[int] = None
    status: Optional[str] = None

class PayrollResponse(BaseModel):
    id: int
    user_id: int
    basic_salary: float
    hra: float
    transport_allowance: float
    other_allowances: float
    tax: float
    provident_fund: float
    insurance: float
    other_deductions: float
    bonus: float
    month: str
    year: int
    status: str
    created_at: datetime
    updated_at: datetime
    
    # Calculated fields
    @property
    def gross_salary(self) -> float:
        return self.basic_salary + self.hra + self.transport_allowance + self.other_allowances + self.bonus
    
    @property
    def total_deductions(self) -> float:
        return self.tax + self.provident_fund + self.insurance + self.other_deductions
    
    @property
    def net_salary(self) -> float:
        return self.gross_salary - self.total_deductions
    
    class Config:
        from_attributes = True

# Leave Balance schemas
class LeaveBalanceCreate(BaseModel):
    user_id: int
    earned_leave_total: Optional[float] = 21.0
    casual_leave_total: Optional[float] = 7.0
    sick_leave_total: Optional[float] = 14.0
    comp_off_total: Optional[float] = 0.0
    year: int

class LeaveBalanceUpdate(BaseModel):
    earned_leave_total: Optional[float] = None
    earned_leave_used: Optional[float] = None
    casual_leave_total: Optional[float] = None
    casual_leave_used: Optional[float] = None
    sick_leave_total: Optional[float] = None
    sick_leave_used: Optional[float] = None
    comp_off_total: Optional[float] = None
    comp_off_used: Optional[float] = None

class LeaveBalanceResponse(BaseModel):
    id: int
    user_id: int
    earned_leave_total: float
    earned_leave_used: float
    casual_leave_total: float
    casual_leave_used: float
    sick_leave_total: float
    sick_leave_used: float
    comp_off_total: float
    comp_off_used: float
    year: int
    created_at: datetime
    updated_at: datetime
    earned_leave_remaining: Optional[float] = None
    casual_leave_remaining: Optional[float] = None
    sick_leave_remaining: Optional[float] = None
    comp_off_remaining: Optional[float] = None
    
    class Config:
        from_attributes = True
    
    @model_validator(mode='after')
    def calculate_remaining(self):
        self.earned_leave_remaining = self.earned_leave_total - self.earned_leave_used
        self.casual_leave_remaining = self.casual_leave_total - self.casual_leave_used
        self.sick_leave_remaining = self.sick_leave_total - self.sick_leave_used
        self.comp_off_remaining = self.comp_off_total - self.comp_off_used
        return self

# Leave Request schemas
class LeaveRequestCreate(BaseModel):
    leave_type: str  # earned, casual, sick, comp_off, unpaid
    start_date: date
    end_date: date
    days: float
    reason: Optional[str] = None

class LeaveRequestUpdate(BaseModel):
    status: Optional[str] = None
    rejection_reason: Optional[str] = None

class LeaveRequestResponse(BaseModel):
    id: int
    user_id: int
    leave_type: str
    start_date: date
    end_date: date
    days: float
    reason: Optional[str]
    status: str
    approved_by: Optional[int]
    approved_at: Optional[datetime]
    rejection_reason: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Attendance schemas
class AttendanceCreate(BaseModel):
    user_id: int
    date: date
    status: str  # present, absent, half_day, leave, holiday_mandatory, holiday_optional, week_off, working_saturday
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    hours_worked: Optional[float] = 0.0
    leave_type: Optional[str] = None
    remarks: Optional[str] = None

class AttendanceUpdate(BaseModel):
    status: Optional[str] = None
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    hours_worked: Optional[float] = None
    leave_type: Optional[str] = None
    remarks: Optional[str] = None

class AttendanceResponse(BaseModel):
    id: int
    user_id: int
    date: date
    status: str
    check_in: Optional[str]
    check_out: Optional[str]
    hours_worked: float
    leave_type: Optional[str]
    remarks: Optional[str]
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int]
    
    class Config:
        from_attributes = True

class BulkAttendanceRow(BaseModel):
    email: str
    date: date
    status: str
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    hours_worked: Optional[float] = 0.0
    leave_type: Optional[str] = None
    holiday_category: Optional[str] = None
    remarks: Optional[str] = None

# Holiday schemas
class HolidayCreate(BaseModel):
    date: date
    name: str
    category: str  # mandatory, optional, week_off
    description: Optional[str] = None
    is_optional: Optional[bool] = False
    year: int

class HolidayUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    is_optional: Optional[bool] = None

class HolidayResponse(BaseModel):
    id: int
    date: date
    name: str
    category: str
    description: Optional[str]
    is_optional: bool
    year: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int]
    
    class Config:
        from_attributes = True

# Working Saturday schemas
class WorkingSaturdayCreate(BaseModel):
    date: date
    reason: str
    description: Optional[str] = None
    comp_off_eligible: Optional[bool] = True
    year: int

class WorkingSaturdayResponse(BaseModel):
    id: int
    date: date
    reason: str
    description: Optional[str]
    comp_off_eligible: bool
    year: int
    created_at: datetime
    created_by: Optional[int]
    
    class Config:
        from_attributes = True

# Optional Holiday Taken schema
class OptionalHolidayTakenCreate(BaseModel):
    holiday_id: int

class OptionalHolidayTakenResponse(BaseModel):
    id: int
    user_id: int
    holiday_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
