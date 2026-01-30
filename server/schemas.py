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
