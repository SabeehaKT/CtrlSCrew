"""
Career API: roadmap summary and career-related endpoints.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List
import os

from auth import get_current_user
from database import User
from config import settings

career_router = APIRouter()


class RoadmapSummaryRequest(BaseModel):
    current_role: str
    next_role: str
    next_date: str  # e.g. "Q3 2024"
    future_role: str
    growth_priorities: Optional[list[str]] = None  # optional for richer narrative


class RoadmapSummaryResponse(BaseModel):
    summary: str


class CareerPathData(BaseModel):
    """Response model for career path data"""
    current_role: str
    experience: int
    skills: List[str]
    recommended_roles: List[dict]
    next_milestone: dict
    growth_priorities: List[dict]
    skill_analysis: dict


# Career progression mapping
CAREER_PATHS = {
    "Backend Developer": {
        "next_roles": [
            {"title": "Senior Backend Developer", "department": "Engineering", "match": 92, "description": "Lead backend architecture and mentor junior developers"},
            {"title": "Full Stack Developer", "department": "Engineering", "match": 85, "description": "Expand to frontend technologies and build end-to-end features"},
            {"title": "DevOps Engineer", "department": "Engineering", "match": 78, "description": "Focus on infrastructure, CI/CD, and deployment automation"},
        ],
        "milestone": {"role": "Senior Backend Developer", "date": "Q3 2025", "future": "Engineering Manager"},
        "priorities": [
            {"skill": "System Design", "current": 75, "target": 90, "color": "#4285F4"},
            {"skill": "Microservices", "current": 65, "target": 85, "color": "#34A853"},
            {"skill": "Leadership", "current": 50, "target": 80, "color": "#FBBC04"},
        ],
    },
    "Frontend Developer": {
        "next_roles": [
            {"title": "Senior Frontend Developer", "department": "Engineering", "match": 90, "description": "Lead UI/UX implementation and component architecture"},
            {"title": "Full Stack Developer", "department": "Engineering", "match": 82, "description": "Expand to backend technologies and APIs"},
            {"title": "UI/UX Engineer", "department": "Design", "match": 75, "description": "Bridge design and development with focus on user experience"},
        ],
        "milestone": {"role": "Senior Frontend Developer", "date": "Q2 2025", "future": "Tech Lead"},
        "priorities": [
            {"skill": "React/Advanced Patterns", "current": 70, "target": 90, "color": "#4285F4"},
            {"skill": "Performance Optimization", "current": 60, "target": 85, "color": "#34A853"},
            {"skill": "Design Systems", "current": 55, "target": 80, "color": "#FBBC04"},
        ],
    },
    "Data Analyst": {
        "next_roles": [
            {"title": "Senior Data Analyst", "department": "Analytics", "match": 88, "description": "Lead data strategy and advanced analytics projects"},
            {"title": "Data Scientist", "department": "Data Science", "match": 80, "description": "Build predictive models and ML solutions"},
            {"title": "Business Intelligence Lead", "department": "Analytics", "match": 75, "description": "Drive BI strategy and data visualization"},
        ],
        "milestone": {"role": "Senior Data Analyst", "date": "Q4 2025", "future": "Data Science Manager"},
        "priorities": [
            {"skill": "Machine Learning", "current": 45, "target": 75, "color": "#4285F4"},
            {"skill": "Statistical Analysis", "current": 70, "target": 90, "color": "#34A853"},
            {"skill": "Data Visualization", "current": 65, "target": 85, "color": "#FBBC04"},
        ],
    },
    "default": {
        "next_roles": [
            {"title": "Senior Role", "department": "Your Department", "match": 85, "description": "Progress to senior level in your current track"},
            {"title": "Team Lead", "department": "Management", "match": 75, "description": "Transition to people management and leadership"},
            {"title": "Specialist", "department": "Your Department", "match": 80, "description": "Become a subject matter expert in your domain"},
        ],
        "milestone": {"role": "Senior Position", "date": "Q3 2025", "future": "Leadership Role"},
        "priorities": [
            {"skill": "Technical Leadership", "current": 60, "target": 85, "color": "#4285F4"},
            {"skill": "Domain Expertise", "current": 70, "target": 90, "color": "#34A853"},
            {"skill": "Communication", "current": 65, "target": 85, "color": "#FBBC04"},
        ],
    },
}


def _generate_roadmap_summary_with_ai(
    current_role: str,
    next_role: str,
    next_date: str,
    future_role: str,
    growth_priorities: Optional[list[str]] = None,
    user_skills: Optional[str] = None,
) -> str:
    """Generate career roadmap summary using OpenAI if available, otherwise template."""
    
    # Check if OpenAI API key is available
    openai_key = getattr(settings, 'OPENAI_API_KEY', None) or os.getenv('OPENAI_API_KEY')
    
    if openai_key and openai_key.startswith('sk-'):
        try:
            import openai
            openai.api_key = openai_key
            
            # Build prompt
            skills_context = f" Current skills: {user_skills}." if user_skills else ""
            priorities_context = f" Focus areas: {', '.join(growth_priorities)}." if growth_priorities else ""
            
            prompt = f"""Create a personalized, motivating career roadmap summary (2-3 sentences) for an employee:
- Current role: {current_role}
- Target role: {next_role} by {next_date}
- Long-term goal: {future_role}
{skills_context}{priorities_context}

Make it actionable, specific, and encouraging. Focus on concrete steps they can take."""

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a career development advisor helping employees plan their growth path."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,
                temperature=0.7,
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"OpenAI API error: {e}. Falling back to template.")
    
    # Fallback to template-based summary
    priorities_text = ""
    if growth_priorities and len(growth_priorities) > 0:
        priorities_text = f" Focus on building {', '.join(growth_priorities[:3])} to bridge the gap."

    return (
        f"Here's how you can get from {current_role} to {next_role}. "
        f"By {next_date}, aim to take on more ownership, cross-team initiatives, and visible projects that align with your next level. "
        f"{priorities_text} "
        f"From there, your path to {future_role} will build on these steps—consider mentorship and curated learning to accelerate your growth."
    )


@career_router.get("/path", response_model=CareerPathData)
async def get_career_path(
    current_user: User = Depends(get_current_user),
):
    """Get personalized career path data for the current user based on their role."""
    
    # Get user's current role and skills from database
    current_role = current_user.role or "Employee"
    experience = current_user.experience or 0
    skills_str = current_user.skills or ""
    skills_list = [s.strip() for s in skills_str.split(",") if s.strip()] if skills_str else []
    
    # Get career path data based on role
    career_data = CAREER_PATHS.get(current_role, CAREER_PATHS["default"])
    
    # Build skill analysis
    skill_analysis = {
        "role": current_role,
        "experience_years": experience,
        "skills_count": len(skills_list),
        "top_skills": skills_list[:5] if skills_list else ["Add skills to see analysis"],
    }
    
    return CareerPathData(
        current_role=current_role,
        experience=experience,
        skills=skills_list,
        recommended_roles=career_data["next_roles"],
        next_milestone=career_data["milestone"],
        growth_priorities=career_data["priorities"],
        skill_analysis=skill_analysis,
    )


@career_router.post("/roadmap-summary", response_model=RoadmapSummaryResponse)
async def get_roadmap_summary(
    body: RoadmapSummaryRequest,
    current_user: User = Depends(get_current_user),
):
    """Generate an AI-powered narrative for the user's career roadmap."""
    
    user_skills = current_user.skills if current_user.skills else None
    
    summary = _generate_roadmap_summary_with_ai(
        current_role=body.current_role,
        next_role=body.next_role,
        next_date=body.next_date,
        future_role=body.future_role,
        growth_priorities=body.growth_priorities,
        user_skills=user_skills,
    )
    return RoadmapSummaryResponse(summary=summary)
