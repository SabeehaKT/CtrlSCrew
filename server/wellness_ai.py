"""
Wellness AI module for activity-based wellness tracking
This module handles passive wellness risk assessment based on work patterns
"""

from datetime import datetime, timedelta, date
from typing import Dict
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import UserActivityLog
from openai import OpenAI
from config import settings

# Initialize OpenAI client
client = OpenAI(api_key=settings.OPENAI_API_KEY)

def calculate_wellness_risk(user_id: int, db: Session) -> Dict:
    """
    Calculate wellness risk score based on user activity patterns.
    Returns risk level, score, and contributing factors.
    """
    risk_score = 0
    risk_factors = []
    
    # Get activity logs from last 14 days
    fourteen_days_ago = date.today() - timedelta(days=14)
    seven_days_ago = date.today() - timedelta(days=7)
    
    activities = db.query(UserActivityLog).filter(
        UserActivityLog.user_id == user_id,
        UserActivityLog.date >= fourteen_days_ago
    ).all()
    
    if not activities:
        return {
            'risk_score': 0,
            'risk_level': 'LOW',
            'risk_factors': ['No activity data available yet'],
            'statistics': {
                'work_days_last_week': 0,
                'total_hours_last_week': 0,
                'learning_days_last_week': 0,
                'average_hours_per_day': 0
            }
        }
    
    # Rule 1: Login after 11 PM on 3 or more days → +2 points
    late_night_logins = 0
    for activity in activities:
        if activity.activity_type == 'login' and activity.login_time:
            if activity.login_time.hour >= 23:
                late_night_logins += 1
    
    if late_night_logins >= 3:
        risk_score += 2
        risk_factors.append(f'Late night work detected ({late_night_logins} days after 11 PM)')
    
    # Rule 2: Session duration greater than 8 hours → +2 points
    long_sessions = 0
    for activity in activities:
        if activity.session_duration_minutes and activity.session_duration_minutes > 480:  # 8 hours = 480 minutes
            long_sessions += 1
    
    if long_sessions > 0:
        risk_score += 2
        risk_factors.append(f'Extended work sessions detected ({long_sessions} sessions over 8 hours)')
    
    # Rule 3: Working continuously for 6 or more days → +2 points
    work_days = set()
    for activity in activities:
        if activity.activity_type in ['login', 'dashboard']:
            work_days.add(activity.date)
    
    # Check for 6 consecutive days
    sorted_days = sorted(work_days)
    max_consecutive = 1
    current_consecutive = 1
    
    for i in range(1, len(sorted_days)):
        if (sorted_days[i] - sorted_days[i-1]).days == 1:
            current_consecutive += 1
            max_consecutive = max(max_consecutive, current_consecutive)
        else:
            current_consecutive = 1
    
    if max_consecutive >= 6:
        risk_score += 2
        risk_factors.append(f'Continuous work detected ({max_consecutive} consecutive days)')
    
    # Rule 4: No learning activity for 14 days → +1 point
    learning_activities = [a for a in activities if a.activity_type == 'learning']
    if not learning_activities:
        risk_score += 1
        risk_factors.append('No learning activity in the past 14 days')
    
    # Determine risk level
    if risk_score >= 5:
        risk_level = 'HIGH'
    elif risk_score >= 3:
        risk_level = 'MEDIUM'
    else:
        risk_level = 'LOW'
    
    # Calculate statistics for last 7 days
    last_week_activities = [a for a in activities if a.date >= seven_days_ago]
    
    work_days_last_week = len(set(a.date for a in last_week_activities if a.activity_type in ['login', 'dashboard']))
    
    total_hours = sum(
        a.session_duration_minutes / 60 
        for a in last_week_activities 
        if a.session_duration_minutes
    )
    
    learning_days = len(set(a.date for a in last_week_activities if a.activity_type == 'learning'))
    
    avg_hours = round(total_hours / work_days_last_week, 1) if work_days_last_week > 0 else 0
    
    return {
        'risk_score': risk_score,
        'risk_level': risk_level,
        'risk_factors': risk_factors if risk_factors else ['No risk factors detected'],
        'statistics': {
            'work_days_last_week': work_days_last_week,
            'total_hours_last_week': round(total_hours, 1),
            'learning_days_last_week': learning_days,
            'average_hours_per_day': avg_hours
        }
    }

def generate_wellness_message(risk_data: Dict) -> str:
    """
    Generate a supportive wellness message using OpenAI based on risk assessment.
    """
    try:
        risk_level = risk_data['risk_level']
        risk_factors = risk_data['risk_factors']
        
        system_prompt = """You are a supportive workplace wellness advisor. Generate a brief, encouraging wellness message based on the employee's work patterns.

RULES:
1. Be supportive and respectful (1-2 sentences only)
2. NO medical language or diagnoses
3. NO alarming statements
4. Focus on work-life balance
5. Be encouraging and practical

Tone: Friendly, non-judgmental, supportive"""

        user_prompt = f"""Risk Level: {risk_level}
Risk Factors: {', '.join(risk_factors)}

Generate a supportive wellness message."""

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=100
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"Error generating wellness message: {str(e)}")
        
        # Fallback messages based on risk level
        fallback_messages = {
            'LOW': "You're maintaining a healthy work-life balance. Keep up the great work!",
            'MEDIUM': "Consider taking regular breaks and time for self-care to maintain your well-being.",
            'HIGH': "Your work patterns suggest you might benefit from more rest and time away from work."
        }
        
        return fallback_messages.get(risk_data['risk_level'], "Remember to prioritize your well-being.")

def get_wellness_insights(user_id: int, db: Session) -> Dict:
    """
    Get complete wellness insights for a user including risk assessment and AI message.
    """
    # Calculate risk
    risk_data = calculate_wellness_risk(user_id, db)
    
    # Generate AI message
    wellness_message = generate_wellness_message(risk_data)
    
    return {
        'risk_level': risk_data['risk_level'],
        'risk_score': risk_data['risk_score'],
        'risk_factors': risk_data['risk_factors'],
        'wellness_message': wellness_message,
        'statistics': risk_data['statistics']
    }

def log_activity(user_id: int, activity_type: str, db: Session, login_time=None, logout_time=None) -> UserActivityLog:
    """
    Log user activity for wellness tracking.
    """
    today = date.today()
    
    # For logout, update the existing login record
    if activity_type == 'logout':
        # Find the most recent login for today
        login_record = db.query(UserActivityLog).filter(
            UserActivityLog.user_id == user_id,
            UserActivityLog.activity_type == 'login',
            UserActivityLog.date == today,
            UserActivityLog.logout_time == None
        ).order_by(UserActivityLog.created_at.desc()).first()
        
        if login_record and login_record.login_time:
            # Update with logout time and calculate duration
            login_record.logout_time = logout_time or datetime.now()
            duration = (login_record.logout_time - login_record.login_time).total_seconds() / 60
            login_record.session_duration_minutes = duration
            db.commit()
            db.refresh(login_record)
            return login_record
    
    # For other activities, create new record
    activity_log = UserActivityLog(
        user_id=user_id,
        activity_type=activity_type,
        date=today,
        login_time=login_time,
        logout_time=logout_time
    )
    
    db.add(activity_log)
    db.commit()
    db.refresh(activity_log)
    
    return activity_log
