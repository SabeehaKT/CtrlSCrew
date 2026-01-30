"""
Career API: roadmap summary and career-related endpoints.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional

from auth import get_current_user
from database import User

career_router = APIRouter()


class RoadmapSummaryRequest(BaseModel):
    current_role: str
    next_role: str
    next_date: str  # e.g. "Q3 2024"
    future_role: str
    growth_priorities: Optional[list[str]] = None  # optional for richer narrative


class RoadmapSummaryResponse(BaseModel):
    summary: str


def _generate_roadmap_summary(
    current_role: str,
    next_role: str,
    next_date: str,
    future_role: str,
    growth_priorities: Optional[list[str]] = None,
) -> str:
    """Generate a short narrative for the career roadmap (template-based).
    Can be extended later with OpenAI when OPENAI_API_KEY is set.
    """
    priorities_text = ""
    if growth_priorities and len(growth_priorities) > 0:
        priorities_text = f" Focus on building {', '.join(growth_priorities[:3])} to bridge the gap."

    return (
        f"Here's how you can get from {current_role} to {next_role}. "
        f"By {next_date}, aim to take on more ownership, cross-team initiatives, and visible projects that align with your next level. "
        f"{priorities_text} "
        f"From there, your path to {future_role} will build on these steps—consider mentorship and curated learning to accelerate your growth."
    )


@career_router.post("/roadmap-summary", response_model=RoadmapSummaryResponse)
async def get_roadmap_summary(
    body: RoadmapSummaryRequest,
    current_user: User = Depends(get_current_user),
):
    """Generate an AI-style narrative for the user's career roadmap.
    Shown at the top of the Edit Roadmap flow.
    """
    summary = _generate_roadmap_summary(
        current_role=body.current_role,
        next_role=body.next_role,
        next_date=body.next_date,
        future_role=body.future_role,
        growth_priorities=body.growth_priorities,
    )
    return RoadmapSummaryResponse(summary=summary)
