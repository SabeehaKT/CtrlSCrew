import os
import json
from typing import List, Dict, Optional
from openai import OpenAI
from config import settings

# Initialize OpenAI client
try:
    client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
except Exception:
    client = None

def load_linkedin_courses() -> List[Dict]:
    """Load courses from linkedin_courses.json"""
    try:
        with open('linkedin_courses.json', 'r', encoding='utf-8') as f:
            courses = json.load(f)
        return courses
    except FileNotFoundError:
        print("Warning: linkedin_courses.json not found")
        return []
    except json.JSONDecodeError:
        print("Error: Invalid JSON in linkedin_courses.json")
        return []

def filter_courses_by_profile(courses: List[Dict], employee_profile: Dict) -> List[Dict]:
    """
    Pre-filter courses based on employee profile before sending to AI
    This reduces token usage and improves relevance
    """
    filtered_courses = []
    
    employee_skills = set([skill.lower().strip() for skill in employee_profile.get('skills', '').split(',') if skill.strip()])
    employee_role = employee_profile.get('role', '').lower()
    employee_experience = employee_profile.get('experience', 0)
    employee_interests = set([interest.lower().strip() for interest in employee_profile.get('area_of_interest', '').split(',') if interest.strip()])
    
    for course in courses:
        course_skills = set([skill.lower().strip() for skill in course.get('skills', [])])
        course_category = course.get('category', '').lower()
        course_level = course.get('level', '').lower()
        
        # Calculate relevance score
        relevance_score = 0
        
        # 1. Skill gap analysis - courses that teach skills the employee doesn't have
        skill_gap = course_skills - employee_skills
        if skill_gap:
            relevance_score += len(skill_gap) * 2
        
        # 2. Skill enhancement - courses that match existing skills (for advancement)
        skill_overlap = course_skills & employee_skills
        if skill_overlap:
            relevance_score += len(skill_overlap)
        
        # 3. Role relevance - does the course category match the role?
        if employee_role and employee_role in course_category:
            relevance_score += 3
        
        # 4. Interest match
        if employee_interests:
            for interest in employee_interests:
                if interest in course_category or interest in course.get('title', '').lower():
                    relevance_score += 2
        
        # 5. Level appropriateness based on experience
        if employee_experience < 2 and 'beginner' in course_level:
            relevance_score += 2
        elif 2 <= employee_experience < 5 and 'intermediate' in course_level:
            relevance_score += 2
        elif employee_experience >= 5 and 'advanced' in course_level:
            relevance_score += 2
        
        # Add course with relevance score
        if relevance_score > 0:
            course_with_score = course.copy()
            course_with_score['_relevance_score'] = relevance_score
            filtered_courses.append(course_with_score)
    
    # Sort by relevance score and return top 15 courses for AI to rank
    filtered_courses.sort(key=lambda x: x.get('_relevance_score', 0), reverse=True)
    return filtered_courses[:15]

def get_ai_course_recommendations(employee_profile: Dict) -> Dict:
    """
    Get AI-powered course recommendations using OpenAI
    """
    try:
        if not client:
            return {
                'success': False,
                'error': 'Course recommendations are not configured. Add OPENAI_API_KEY to .env to enable AI recommendations.',
                'recommendations': []
            }
        # Load all courses
        all_courses = load_linkedin_courses()
        
        if not all_courses:
            return {
                'success': False,
                'error': 'No courses available',
                'recommendations': []
            }
        
        # Pre-filter courses
        filtered_courses = filter_courses_by_profile(all_courses, employee_profile)
        
        if not filtered_courses:
            # If no filtered courses, use top 15 courses
            filtered_courses = all_courses[:15]
        
        # Remove the internal relevance score before sending to AI
        courses_for_ai = []
        for course in filtered_courses:
            course_copy = course.copy()
            course_copy.pop('_relevance_score', None)
            courses_for_ai.append(course_copy)
        
        # Prepare prompt for OpenAI
        system_prompt = """You are an expert career development advisor specializing in employee learning and development. 
Your task is to analyze an employee's profile and recommend the most relevant courses from a provided list.

Your recommendations should:
1. Address skill gaps relevant to their role
2. Support career growth and advancement
3. Match their experience level
4. Align with their areas of interest
5. Provide clear, actionable reasoning

Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "title": "Course Title",
      "priority": 1,
      "reason": "Brief explanation (2-3 sentences)"
    }
  ]
}"""

        user_prompt = f"""Employee Profile:
- Name: {employee_profile.get('name', 'Unknown')}
- Role: {employee_profile.get('role', 'Not specified')}
- Experience: {employee_profile.get('experience', 0)} years
- Current Skills: {employee_profile.get('skills', 'None specified')}
- Areas of Interest: {employee_profile.get('area_of_interest', 'None specified')}

Available Courses:
{json.dumps(courses_for_ai, indent=2)}

Please analyze this employee's profile and recommend the TOP 5 most relevant courses from the provided list. 
Rank them by priority (1 being highest) and explain why each course is recommended.

Return your response as valid JSON only."""

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o",  # Using GPT-4o as specified
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=2000,
            response_format={"type": "json_object"}
        )
        
        # Parse AI response
        ai_response = json.loads(response.choices[0].message.content)
        recommendations = ai_response.get('recommendations', [])
        
        # Enrich recommendations with full course details
        enriched_recommendations = []
        for rec in recommendations[:5]:  # Ensure only top 5
            # Find the full course details
            course_title = rec.get('title', '')
            full_course = next((c for c in all_courses if c.get('title') == course_title), None)
            
            if full_course:
                enriched_recommendations.append({
                    'title': full_course.get('title'),
                    'skills': full_course.get('skills', []),
                    'category': full_course.get('category'),
                    'level': full_course.get('level'),
                    'course_url': full_course.get('course_url'),
                    'priority': rec.get('priority', 0),
                    'reason': rec.get('reason', '')
                })
        
        return {
            'success': True,
            'employee_name': employee_profile.get('name'),
            'employee_role': employee_profile.get('role'),
            'recommendations': enriched_recommendations,
            'total_courses_analyzed': len(filtered_courses)
        }
    
    except Exception as e:
        print(f"Error getting AI recommendations: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'recommendations': []
        }
