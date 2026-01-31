from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, User
from auth import get_current_user
from wellness_ai import get_wellness_insights, log_activity
from story_wellbeing import (
    load_story_and_questions,
    classify_mood_with_ai,
    get_recommendations_for_mood,
    save_wellbeing_response,
    get_or_create_active_story
)
from datetime import datetime
from pydantic import BaseModel
from typing import Dict

wellness_router = APIRouter()

# Pydantic model for wellbeing submission
class WellbeingSubmission(BaseModel):
    answers: Dict[str, str]  # Question ID to answer mapping

@wellness_router.get("/wellness-insights")
async def get_user_wellness_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get wellness insights and risk assessment for the current user"""
    try:
        insights = get_wellness_insights(current_user.id, db)
        
        return {
            'success': True,
            'user_name': current_user.name,
            'insights': insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching wellness insights: {str(e)}")

@wellness_router.post("/log-activity")
async def log_user_activity(
    activity_type: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log user activity (dashboard, learning, etc.)"""
    try:
        # Validate activity type
        valid_types = ['dashboard', 'learning', 'login', 'logout']
        if activity_type not in valid_types:
            raise HTTPException(status_code=400, detail=f"Invalid activity type. Must be one of: {', '.join(valid_types)}")
        
        # Log the activity
        activity_log = log_activity(
            user_id=current_user.id,
            activity_type=activity_type,
            db=db,
            login_time=datetime.now() if activity_type == 'login' else None,
            logout_time=datetime.now() if activity_type == 'logout' else None
        )
        
        return {
            'success': True,
            'message': f'Activity "{activity_type}" logged successfully',
            'activity_id': activity_log.id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error logging activity: {str(e)}")

# Story-based wellbeing endpoints
@wellness_router.get("/story")
async def get_wellbeing_story(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the active wellbeing story and reflection questions"""
    try:
        # Get or create active story in database
        db_story = get_or_create_active_story(db)
        
        # Load questions from JSON
        story_data = load_story_and_questions()
        
        return {
            'success': True,
            'story': {
                'id': db_story.id,
                'title': db_story.title,
                'story_text': db_story.story_text
            },
            'questions': story_data['questions']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching story: {str(e)}")

@wellness_router.post("/submit")
async def submit_wellbeing_response(
    submission: WellbeingSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit wellbeing reflection answers and get mood classification with recommendations"""
    try:
        # Get active story
        db_story = get_or_create_active_story(db)
        
        # Validate that we have answers for all 5 questions
        if len(submission.answers) != 5:
            raise HTTPException(
                status_code=400,
                detail="All 5 questions must be answered"
            )
        
        # Classify mood using AI (pass user's first name for personalization)
        user_first_name = current_user.name.split()[0] if current_user.name else None
        mood_result = classify_mood_with_ai(
            story_text=db_story.story_text,
            answers=submission.answers,
            user_name=user_first_name
        )
        
        # Get recommendations based on mood
        recommendations = get_recommendations_for_mood(mood_result['mood'])
        
        # Save response to database
        save_wellbeing_response(
            user_id=current_user.id,
            story_id=db_story.id,
            answers=submission.answers,
            mood=mood_result['mood'],
            reason=mood_result['reason'],
            db=db
        )
        
        return {
            'success': True,
            'mood': mood_result['mood'],
            'reason': mood_result['reason'],
            'recommended_resources': recommendations
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing submission: {str(e)}")
