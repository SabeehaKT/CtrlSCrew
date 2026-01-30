from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

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
