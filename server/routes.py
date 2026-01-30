from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db, User
from schemas import AdminUserCreate, UserLogin, Token, UserResponse, UserUpdate
from auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_admin,
    get_user_by_email
)
from config import settings

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
        is_admin=user.is_admin
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
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Admin only: Update a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields
    if user_update.name:
        user.name = user_update.name
    if user_update.email:
        # Check if email is already taken
        existing_user = get_user_by_email(db, email=user_update.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        user.email = user_update.email
    if user_update.password:
        user.hashed_password = get_password_hash(user_update.password)
    
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
