import json
from typing import Dict, List
from sqlalchemy.orm import Session
from database import WellbeingStory, WellbeingResponse
from openai import OpenAI
from config import settings

# Initialize OpenAI client
client = OpenAI(api_key=settings.OPENAI_API_KEY)

# Allowed mood categories (STRICT)
ALLOWED_MOODS = ['CALM', 'MOTIVATED', 'STRESSED', 'OVERWHELMED', 'DISENGAGED']

# Resource recommendations based on mood
MOOD_RESOURCES = {
    'CALM': {
        'title': 'Keep Your Balance',
        'resources': [
            {
                'title': 'Daily Mindfulness Practice',
                'type': 'Activity',
                'description': 'Continue your 5-minute daily mindfulness meditation to maintain inner peace',
                'url': 'https://www.headspace.com/meditation'
            },
            {
                'title': 'Gratitude Journaling',
                'type': 'Habit',
                'description': 'Write down 3 things you\'re grateful for each day to stay positive',
                'url': 'https://www.calm.com/blog/gratitude-journaling'
            },
            {
                'title': 'Learning & Growth',
                'type': 'Course',
                'description': 'Explore new skills to keep yourself engaged and growing',
                'url': 'https://www.linkedin.com/learning/'
            }
        ]
    },
    'MOTIVATED': {
        'title': 'Channel Your Energy Wisely',
        'resources': [
            {
                'title': 'Power Hour Planning',
                'type': 'Activity',
                'description': 'Dedicate your peak energy hours to most important tasks',
                'url': 'https://www.todoist.com/productivity-methods/time-blocking'
            },
            {
                'title': 'Sustainable Pace',
                'type': 'Reminder',
                'description': 'Remember to take short breaks every 90 minutes to avoid burnout',
                'url': 'https://www.calm.com/blog/pomodoro-technique'
            },
            {
                'title': 'Goal Setting Workshop',
                'type': 'Course',
                'description': 'Set clear, achievable goals to direct your motivation effectively',
                'url': 'https://www.linkedin.com/learning/'
            }
        ]
    },
    'STRESSED': {
        'title': 'Stress Relief Activities',
        'resources': [
            {
                'title': '4-7-8 Breathing Exercise',
                'type': 'Exercise',
                'description': 'Breathe in for 4 seconds, hold for 7, exhale for 8. Repeat 4 times to calm your nervous system',
                'url': 'https://www.healthline.com/health/4-7-8-breathing'
            },
            {
                'title': '5-Minute Desk Yoga',
                'type': 'Exercise',
                'description': 'Simple stretches you can do at your desk to release tension',
                'url': 'https://www.youtube.com/results?search_query=5+minute+desk+yoga'
            },
            {
                'title': 'Take a Mindful Walk',
                'type': 'Activity',
                'description': 'Step outside for 10 minutes. Focus on your surroundings, not your tasks',
                'url': 'https://www.headspace.com/meditation/walking-meditation'
            },
            {
                'title': 'Time Management Tips',
                'type': 'Article',
                'description': 'Learn to prioritize tasks and set realistic boundaries',
                'url': 'https://www.mindtools.com/pages/article/newHTE_00.htm'
            }
        ]
    },
    'OVERWHELMED': {
        'title': 'Immediate Relief & Support',
        'resources': [
            {
                'title': 'Box Breathing (4-4-4-4)',
                'type': 'Exercise',
                'description': 'Breathe in for 4, hold for 4, exhale for 4, hold for 4. Reduces anxiety immediately',
                'url': 'https://www.healthline.com/health/box-breathing'
            },
            {
                'title': 'Progressive Muscle Relaxation',
                'type': 'Exercise',
                'description': 'Tense and release each muscle group to release physical stress',
                'url': 'https://www.anxietycanada.com/articles/how-to-do-progressive-muscle-relaxation/'
            },
            {
                'title': 'Take a Mental Health Break',
                'type': 'Action',
                'description': 'Step away from work for 15-30 minutes. Listen to calming music or meditate',
                'url': 'https://www.calm.com/'
            },
            {
                'title': 'Talk to Your Manager',
                'type': 'Action',
                'description': 'Schedule a 1-on-1 to discuss workload and get support. It\'s okay to ask for help',
                'url': '#'
            },
            {
                'title': 'Guided Meditation for Stress',
                'type': 'Exercise',
                'description': '10-minute guided meditation to calm your mind and restore balance',
                'url': 'https://www.headspace.com/meditation/stress'
            }
        ]
    },
    'DISENGAGED': {
        'title': 'Reconnect & Recharge',
        'resources': [
            {
                'title': 'Identify Your "Why"',
                'type': 'Activity',
                'description': 'Journal about what originally excited you about this role. Reconnect with purpose',
                'url': 'https://www.calm.com/blog/finding-purpose'
            },
            {
                'title': 'Try Something New',
                'type': 'Activity',
                'description': 'Take on a small project outside your usual tasks to spark interest',
                'url': '#'
            },
            {
                'title': 'Connect with Colleagues',
                'type': 'Social',
                'description': 'Schedule a casual coffee chat with a teammate to rebuild connection',
                'url': '#'
            },
            {
                'title': 'Morning Energizing Routine',
                'type': 'Exercise',
                'description': '5-minute morning stretches or light exercise to boost energy',
                'url': 'https://www.youtube.com/results?search_query=morning+energizing+yoga'
            },
            {
                'title': 'Career Reflection Exercise',
                'type': 'Activity',
                'description': 'Assess if your role aligns with your goals and interests',
                'url': 'https://www.linkedin.com/learning/'
            }
        ]
    }
}

def load_story_and_questions() -> Dict:
    """Load the active story and questions from JSON file"""
    try:
        with open('wellbeing_story.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        raise Exception("wellbeing_story.json not found")
    except json.JSONDecodeError:
        raise Exception("Invalid JSON in wellbeing_story.json")

def classify_mood_with_ai(story_text: str, answers: Dict, user_name: str = None) -> Dict:
    """
    Use OpenAI to classify employee mood based on story and answers.
    Returns mood and reason.
    """
    
    try:
        # Construct prompt for OpenAI
        system_prompt = f"""You are a workplace wellbeing advisor. Analyze employee responses to reflection questions and classify their mood.

CRITICAL INSTRUCTIONS:
1. The story context is ONLY for reference to understand the questions - it is NOT about this employee
2. Base your classification SOLELY on the employee's actual responses, NOT on the story
3. Classify the mood as EXACTLY ONE of these: {', '.join(ALLOWED_MOODS)}
4. Do NOT use any other mood categories
5. Return ONLY valid JSON
6. Do NOT include medical or diagnostic language
7. Do NOT mention the story character's name (Maya) in your response
8. If a user name is provided, you may use it naturally in your explanation

Mood Guidelines:
- CALM: Balanced responses, manages stress well, takes breaks, feels content
- MOTIVATED: Energized, enthusiastic, passionate, engaged, positive about work
- STRESSED: Experiencing pressure, tight deadlines, some anxiety but managing
- OVERWHELMED: Exhausted, burned out, too much work, struggling to cope
- DISENGAGED: Unmotivated, bored, disconnected, low interest

Return format:
{{
  "mood": "<ONE_OF_ALLOWED_MOODS>",
  "reason": "<brief explanation in 1-2 sentences, addressing the employee directly or using their name if provided>"
}}"""

        # Format answers for prompt
        answers_text = "\n".join([f"Q{q_id}: {answer}" for q_id, answer in answers.items()])

        user_name_context = f"\nEmployee Name: {user_name}" if user_name else ""

        user_prompt = f"""Employee Responses (analyze THESE responses only, ignore the story tone):
{answers_text}{user_name_context}

IMPORTANT: Classify based on what the employee ACTUALLY said in their responses, not based on the story context. If they describe positive feelings, good work-life balance, taking breaks, and being motivated, classify accordingly as CALM or MOTIVATED.

Classify the employee's mood based ONLY on their responses above."""

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.5,  # Slightly higher for better mood differentiation
            max_tokens=250,
            response_format={"type": "json_object"}
        )
        
        # Parse AI response
        ai_response = json.loads(response.choices[0].message.content)
        mood = ai_response.get('mood', '').upper()
        reason = ai_response.get('reason', '')
        
        # Validate mood
        if mood not in ALLOWED_MOODS:
            print(f"Warning: AI returned invalid mood '{mood}'. Defaulting to STRESSED.")
            mood = 'STRESSED'
            reason = "Unable to determine specific mood from responses. General stress indicators detected."
        
        return {
            'mood': mood,
            'reason': reason
        }
    
    except Exception as e:
        print(f"Error in AI mood classification: {str(e)}")
        
        # Fallback classification based on keywords
        answers_lower = str(answers).lower()
        
        # Check for positive indicators first
        positive_words = ['great', 'excellent', 'good', 'happy', 'satisfied', 'balanced', 'well', 'energized', 'motivated', 'excited', 'passionate', 'fulfilling']
        negative_words = ['exhausted', 'tired', 'burned out', 'overwhelming', 'too much']
        stress_words = ['stressed', 'pressure', 'anxious', 'worried', 'deadline']
        disengaged_words = ['unmotivated', 'bored', 'disconnected', 'uninterested', 'nothing']
        
        positive_count = sum(1 for word in positive_words if word in answers_lower)
        negative_count = sum(1 for word in negative_words if word in answers_lower)
        
        # Prioritize positive indicators
        if positive_count >= 2 and negative_count == 0:
            if any(word in answers_lower for word in ['motivated', 'excited', 'energized', 'passionate']):
                return {
                    'mood': 'MOTIVATED',
                    'reason': 'Your responses show strong motivation and positive energy toward your work.'
                }
            else:
                return {
                    'mood': 'CALM',
                    'reason': 'Your responses suggest a healthy work-life balance and contentment.'
                }
        
        # Then check for negative indicators
        if any(word in answers_lower for word in negative_words):
            return {
                'mood': 'OVERWHELMED',
                'reason': 'Your responses indicate signs of exhaustion and high workload.'
            }
        elif any(word in answers_lower for word in stress_words):
            return {
                'mood': 'STRESSED',
                'reason': 'Your responses suggest experiencing work-related pressure.'
            }
        elif any(word in answers_lower for word in disengaged_words):
            return {
                'mood': 'DISENGAGED',
                'reason': 'Your responses indicate reduced engagement with work.'
            }
        else:
            # Default to CALM if no strong indicators
            return {
                'mood': 'CALM',
                'reason': 'Your responses suggest a balanced and stable work state.'
            }

def get_recommendations_for_mood(mood: str) -> Dict:
    """Get resource recommendations based on detected mood"""
    return MOOD_RESOURCES.get(mood, MOOD_RESOURCES['CALM'])

def save_wellbeing_response(
    user_id: int,
    story_id: int,
    answers: Dict,
    mood: str,
    reason: str,
    db: Session
) -> WellbeingResponse:
    """Save wellbeing response to database"""
    
    response = WellbeingResponse(
        user_id=user_id,
        story_id=story_id,
        answers_json=answers,
        detected_mood=mood,
        mood_reason=reason
    )
    
    db.add(response)
    db.commit()
    db.refresh(response)
    
    return response

def get_or_create_active_story(db: Session) -> WellbeingStory:
    """Get active story from database or create one from JSON"""
    
    # Check if active story exists
    active_story = db.query(WellbeingStory).filter(WellbeingStory.active == True).first()
    
    if active_story:
        return active_story
    
    # Load from JSON and create
    story_data = load_story_and_questions()
    
    new_story = WellbeingStory(
        title=story_data['story']['title'],
        story_text=story_data['story']['story_text'],
        active=True
    )
    
    db.add(new_story)
    db.commit()
    db.refresh(new_story)
    
    return new_story
