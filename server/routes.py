from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db, User
from schemas import AdminUserCreate, UserLogin, Token, UserResponse, UserUpdate, AdminUserUpdate, UserProfileUpdate, PasswordChange
from auth import (
    get_password_hash,
    verify_password,
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_admin,
    get_user_by_email
)
from config import settings
from course_recommendation import get_ai_course_recommendations

# Auth router
auth_router = APIRouter()

@auth_router.post("/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    """Login user and return JWT token"""
    # Authenticate user
    db_user = authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current logged-in user information"""
    return current_user

# User router
user_router = APIRouter()

@user_router.get("/profile", response_model=UserResponse)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get user profile (protected route)"""
    return current_user

@user_router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's personal profile fields"""
    user = db.query(User).filter(User.id == current_user.id).first()
    
    # Update only personal fields
    if profile_update.phone is not None:
        user.phone = profile_update.phone
    if profile_update.address is not None:
        user.address = profile_update.address
    if profile_update.area_of_interest is not None:
        user.area_of_interest = profile_update.area_of_interest
    if profile_update.profile_photo is not None:
        user.profile_photo = profile_update.profile_photo
    
    db.commit()
    db.refresh(user)
    return user

@user_router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    user = db.query(User).filter(User.id == current_user.id).first()
    
    # Verify old password
    if not verify_password(password_data.old_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    # Update password
    user.hashed_password = get_password_hash(password_data.new_password)
    user.must_change_password = False
    
    db.commit()
    return {"message": "Password changed successfully"}

@user_router.get("/course-recommendations")
async def get_course_recommendations(
    current_user: User = Depends(get_current_user)
):
    """Get AI-powered course recommendations for the current user.
    Returns 200 with success=false and empty recommendations when AI is unavailable.
    """
    employee_profile = {
        'name': current_user.name,
        'email': current_user.email,
        'role': current_user.role or 'Not specified',
        'experience': current_user.experience or 0,
        'skills': current_user.skills or '',
        'area_of_interest': current_user.area_of_interest or ''
    }
    
    result = get_ai_course_recommendations(employee_profile)
    
    # Always return 200 so the Learning page can render; frontend checks result.success
    if not result.get('success'):
        return {
            'success': False,
            'error': result.get('error', 'Recommendations temporarily unavailable'),
            'recommendations': [],
            'total_courses_analyzed': 0
        }
    
    return result

# Admin router
admin_router = APIRouter()

@admin_router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user: AdminUserCreate, 
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Admin only: Create a new user"""
    # Check if user already exists
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        is_admin=user.is_admin,
        must_change_password=True,  # Force password change on first login
        role=user.role,
        experience=user.experience,
        skills=user.skills
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@admin_router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Admin only: Get all users"""
    users = db.query(User).all()
    return users

@admin_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Admin only: Get a specific user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@admin_router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_update: AdminUserUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Admin only: Update a user (employment fields)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields
    if user_update.name is not None:
        user.name = user_update.name
    if user_update.email is not None:
        # Check if email is already taken
        existing_user = get_user_by_email(db, email=user_update.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        user.email = user_update.email
    if user_update.password is not None:
        user.hashed_password = get_password_hash(user_update.password)
        user.must_change_password = True  # Force password change after admin reset
    if user_update.role is not None:
        user.role = user_update.role
    if user_update.experience is not None:
        user.experience = user_update.experience
    if user_update.skills is not None:
        user.skills = user_update.skills
    if user_update.is_admin is not None:
        user.is_admin = user_update.is_admin
    
    db.commit()
    db.refresh(user)
    return user

@admin_router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Admin only: Delete a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent admin from deleting themselves
    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    db.delete(user)
    db.commit()
    return None
