# Story-Based Wellbeing Feature - Documentation

## Overview

The Story-Based Wellbeing Check-in feature helps employees reflect on their work experiences through storytelling and receive personalized mood-based recommendations.

**Key Features:**
- ✅ Predefined reflection story
- ✅ 5 structured reflection questions
- ✅ AI mood classification (OpenAI GPT-4o)
- ✅ Resource recommendations based on mood
- ✅ NO medical data or passive tracking

---

## System Architecture

### 1. Database Models

**wellbeing_story**
```python
- id: Primary key
- title: Story title
- story_text: Full story content
- active: Boolean (is this story active?)
- created_at: Timestamp
```

**wellbeing_response**
```python
- id: Primary key
- user_id: Foreign key to users
- story_id: Foreign key to wellbeing_story
- answers_json: JSON object with answers
- detected_mood: One of allowed moods
- mood_reason: AI explanation
- created_at: Timestamp
```

### 2. Allowed Mood Categories (STRICT)

The system uses **EXACTLY** these 5 moods:

| Mood | Description | Color Code |
|------|-------------|------------|
| **CALM** | Balanced and stable work state | 🟢 Green |
| **MOTIVATED** | High energy and enthusiasm | 🔵 Blue |
| **STRESSED** | Experiencing pressure | 🟠 Orange |
| **OVERWHELMED** | High workload, exhaustion | 🔴 Red |
| **DISENGAGED** | Low engagement | 🟣 Purple |

**No other moods are allowed.** The AI is strictly constrained to use only these categories.

---

## The Story & Questions

### Current Story: "The Project That Never Slept"

**Story:**
> Maya was a talented software engineer working on a critical product launch. For three weeks straight, she stayed late at the office, skipped lunch breaks, and checked emails before bed. Her team celebrated when the product went live, but Maya felt exhausted rather than excited. The next morning, she struggled to focus on her new tasks and found herself staring blankly at her screen. Her manager noticed and suggested she take the rest of the day off, but Maya worried about falling behind.

### The 5 Reflection Questions:

1. "How often do you feel physically or mentally exhausted by the end of your workday?"
2. "When you have multiple deadlines, how do you typically handle the pressure?"
3. "In the past week, have you taken time for activities that help you relax or recharge? If yes, what did you do?"
4. "How would you describe your current motivation level at work?"
5. "If you could change one thing about your current work situation to feel better, what would it be?"

These questions are **the same for all employees** and stored in `wellbeing_story.json`.

---

## OpenAI Integration

### What OpenAI Does

OpenAI is used **ONLY** for mood classification based on employee answers.

### Input to OpenAI

```python
{
  "story_text": "The Project That Never Slept...",
  "answers": {
    "1": "I feel exhausted almost every day...",
    "2": "I usually panic and work longer hours...",
    "3": "No, I haven't had time for myself...",
    "4": "Very low, I feel disconnected...",
    "5": "Better work-life balance..."
  }
}
```

### OpenAI Prompt Rules

The system prompt ensures:
1. ✅ Use ONLY the 5 allowed moods
2. ✅ Return JSON only
3. ✅ NO medical/diagnostic language
4. ✅ Focus on work-life balance patterns
5. ✅ Provide brief 1-2 sentence explanation

### Output from OpenAI

```json
{
  "mood": "OVERWHELMED",
  "reason": "Responses indicate signs of exhaustion, lack of rest, and difficulty maintaining work-life boundaries."
}
```

### Fallback Behavior

If OpenAI fails, the system uses keyword-based classification:
- Keywords like "exhausted", "overwhelmed" → OVERWHELMED
- Keywords like "stressed", "pressure" → STRESSED
- Keywords like "unmotivated", "bored" → DISENGAGED
- Keywords like "motivated", "excited" → MOTIVATED
- Default → CALM

---

## Resource Recommendations

Based on detected mood, the system recommends relevant **wellness activities and practical exercises**:

### CALM
**Title:** Keep Your Balance
- **Daily Mindfulness Practice** (Activity) - 5-minute daily meditation
- **Gratitude Journaling** (Habit) - Write 3 things you're grateful for daily
- **Learning & Growth** (Course) - Explore new skills

### MOTIVATED
**Title:** Channel Your Energy Wisely
- **Power Hour Planning** (Activity) - Use peak energy for important tasks
- **Sustainable Pace** (Reminder) - Take breaks every 90 minutes
- **Goal Setting Workshop** (Course) - Set clear, achievable goals

### STRESSED
**Title:** Stress Relief Activities
- **4-7-8 Breathing Exercise** (Exercise) - Breathe in 4s, hold 7s, exhale 8s
- **5-Minute Desk Yoga** (Exercise) - Simple stretches to release tension
- **Take a Mindful Walk** (Activity) - 10-minute outdoor mindful walk
- **Time Management Tips** (Article) - Prioritize and set boundaries

### OVERWHELMED
**Title:** Immediate Relief & Support
- **Box Breathing (4-4-4-4)** (Exercise) - Reduces anxiety immediately
- **Progressive Muscle Relaxation** (Exercise) - Tense and release muscles
- **Take a Mental Health Break** (Action) - 15-30 minute break with calming music
- **Talk to Your Manager** (Action) - Discuss workload and get support
- **Guided Meditation for Stress** (Exercise) - 10-minute guided meditation

### DISENGAGED
**Title:** Reconnect & Recharge
- **Identify Your "Why"** (Activity) - Journal about what excites you
- **Try Something New** (Activity) - Take on a small project outside usual tasks
- **Connect with Colleagues** (Social) - Coffee chat with teammate
- **Morning Energizing Routine** (Exercise) - 5-minute stretches or light exercise
- **Career Reflection Exercise** (Activity) - Assess role alignment with goals

---

## API Endpoints

### 1. Get Story and Questions

**Endpoint:** `GET /api/wellness/story`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "story": {
    "id": 1,
    "title": "The Project That Never Slept",
    "story_text": "Maya was a talented software engineer..."
  },
  "questions": [
    {
      "id": 1,
      "question": "How often do you feel physically or mentally exhausted...",
      "type": "text"
    },
    ...
  ]
}
```

### 2. Submit Reflection Answers

**Endpoint:** `POST /api/wellness/submit`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "answers": {
    "1": "I feel exhausted almost every day",
    "2": "I usually panic and work longer hours",
    "3": "No, I haven't had time for myself",
    "4": "Very low, I feel disconnected",
    "5": "Better work-life balance"
  }
}
```

**Response:**
```json
{
  "success": true,
  "mood": "OVERWHELMED",
  "reason": "Responses indicate signs of exhaustion...",
  "recommended_resources": {
    "title": "Task Prioritization Resources",
    "resources": [
      {
        "title": "Priority Management",
        "type": "Course",
        "description": "Learn to prioritize what truly matters",
        "url": "https://www.linkedin.com/learning/"
      },
      ...
    ]
  }
}
```

---

## Frontend Implementation

### Well-being Page (`/wellbeing`)

**Location:** `client/pages/wellbeing.js`

**Features:**

**Two Tabs:**
1. **Story Check-in** - Story-based reflection
2. **Wellness Insights** - Passive activity tracking insights

**Story Check-in Flow:**

1. **View Story**
   - Display the reflection story
   - Set the context for questions

2. **Answer Questions** (5-step process)
   - Progress stepper showing current question
   - Multiline text input for each answer
   - Navigation: Back/Next buttons
   - Validation: Must answer all questions

3. **Submit Answers**
   - "Submit" button on last question
   - Loading state while AI analyzes
   - Automatic mood classification

4. **View Results**
   - Display detected mood with color-coded badge
   - Show AI-generated reason
   - List recommended resources
   - Option to retake check-in

**Design Features:**
- Dark theme consistency
- Smooth transitions
- Progress tracking
- Responsive layout
- Clear CTAs

---

## Files Created/Modified

### Backend Files

**New Files:**
1. `server/story_wellbeing.py` - Core story & mood logic
2. `server/wellbeing_story.json` - Story and questions data

**Modified Files:**
1. `server/database.py` - Added WellbeingStory and WellbeingResponse models
2. `server/wellness.py` - Added /story and /submit endpoints

### Frontend Files

**Modified Files:**
1. `client/pages/wellbeing.js` - Complete redesign with two tabs
2. `client/utils/apiClient.js` - Added story wellbeing methods

---

## Testing the Feature

### 1. Start Both Servers

**Backend:**
```bash
cd server
.\venv\Scripts\activate
python main.py
```

**Frontend:**
```bash
cd client
npm run dev
```

### 2. Access the Feature

1. Login as an employee
2. Navigate to Well-being page: http://localhost:3000/wellbeing
3. You'll see two tabs:
   - **Story Check-in** (active by default)
   - **Wellness Insights**

### 3. Complete a Check-in

1. Read the story "The Project That Never Slept"
2. Answer all 5 reflection questions
3. Click through with Next buttons
4. Submit on the last question
5. Wait 2-5 seconds for AI analysis
6. View your mood classification and recommendations

### 4. Test Different Moods

To test different mood classifications, vary your answers:

**For OVERWHELMED:**
- Mention exhaustion, too much work, no time
- Example: "I feel exhausted every day and can't keep up"

**For STRESSED:**
- Mention pressure, anxiety, deadlines
- Example: "I feel stressed with all the deadlines"

**For DISENGAGED:**
- Mention boredom, lack of motivation
- Example: "I feel unmotivated and disconnected"

**For MOTIVATED:**
- Mention energy, excitement, passion
- Example: "I'm excited and energized by my work"

**For CALM:**
- Mention balance, stability, contentment
- Example: "I feel balanced and things are manageable"

---

## Privacy & Ethics

### What We Collect
- ✅ Reflection answers (text responses)
- ✅ Detected mood classification
- ✅ Timestamp of check-in

### What We DON'T Collect
- ❌ Screen activity or keystrokes
- ❌ Medical/health data
- ❌ Passive behavioral tracking
- ❌ Personal communications
- ❌ Location or biometric data

### AI Usage Ethics
- OpenAI only receives story text + answers
- No personal identifiable information sent
- Classification is for wellness support, not evaluation
- NOT used for performance reviews or disciplinary action
- Employee has full control over participation

---

## Customization Options

### Add More Stories

1. Edit `wellbeing_story.json`:
```json
{
  "story": {
    "title": "Your New Story Title",
    "story_text": "Your new story content..."
  },
  "questions": [...]
}
```

2. Restart the backend
3. New story will be loaded automatically

### Change Questions

Edit the `questions` array in `wellbeing_story.json`:
```json
{
  "id": 6,
  "question": "Your new question?",
  "type": "text"
}
```

**Important:** Always keep exactly 5 questions.

### Modify Resource Recommendations

Edit `MOOD_RESOURCES` in `story_wellbeing.py`:
```python
MOOD_RESOURCES = {
    'CALM': {
        'title': 'Your Custom Title',
        'resources': [
            {
                'title': 'Your Resource',
                'type': 'Course',
                'description': 'Description',
                'url': 'https://...'
            }
        ]
    }
}
```

---

## Troubleshooting

### Story Not Loading
**Issue:** Page shows loading forever

**Solution:**
- Check `wellbeing_story.json` exists in `server/` directory
- Verify JSON syntax is valid
- Check backend logs for errors

### AI Returns Wrong Mood
**Issue:** Mood doesn't match answers

**Solution:**
- Check OpenAI API key in `.env`
- Verify API has credits
- Check backend logs for OpenAI errors
- System will use keyword fallback if AI fails

### Questions Not Appearing
**Issue:** No questions showing on page

**Solution:**
- Verify `wellbeing_story.json` has `questions` array
- Check all questions have `id` and `question` fields
- Restart backend after JSON changes

### Submit Button Disabled
**Issue:** Can't submit answers

**Solution:**
- Must answer all 5 questions
- Check if all text fields have content
- Try refreshing the page

---

## Future Enhancements

Potential improvements:
- Multiple stories to choose from
- Weekly check-in reminders
- Mood tracking over time (trends)
- Manager dashboard (anonymized team mood)
- Integration with calendar for workload analysis
- Customizable questions per department
- Video or audio story narration

---

## Support

For issues or questions:
1. Check backend logs: `server/` terminal
2. Check frontend console: Browser DevTools
3. Review database: `server/employee_portal.db`
4. Check `wellbeing_story.json` format
5. Verify OpenAI API key and credits

---

**Built with care to support employee mental wellness through reflective storytelling** 🧘✨
