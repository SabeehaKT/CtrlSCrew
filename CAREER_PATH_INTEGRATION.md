# Career Path Integration Guide

## Overview
The Career Path page has been successfully integrated with the backend database and OpenAI API for AI-powered career recommendations.

## What Was Implemented

### 1. Backend Integration (`server/career.py`)

#### New Endpoint: `GET /api/career/path`
Fetches personalized career path data for the current user based on their role from the database.

**Response includes:**
- Current role (from `users.role` in database)
- Experience years (from `users.experience`)
- Skills list (from `users.skills`)
- Recommended internal roles (3 suggestions with match percentages)
- Next career milestone (next role, target date, future role)
- Growth priorities (skills to develop with current/target percentages)

#### Career Path Mapping
The backend includes predefined career paths for:
- **Backend Developer** → Senior Backend Developer, Full Stack Developer, DevOps Engineer
- **Frontend Developer** → Senior Frontend Developer, Full Stack Developer, UI/UX Engineer
- **Data Analyst** → Senior Data Analyst, Data Scientist, Business Intelligence Lead
- **Default** → Generic progression for other roles

Each path includes:
- 3 recommended next roles with match percentages and descriptions
- Next milestone with target date and future role
- 3 growth priorities with current/target skill levels

### 2. AI Integration with OpenAI

#### Enhanced Endpoint: `POST /api/career/roadmap-summary`
Now supports AI-generated career roadmap narratives using OpenAI GPT-3.5-turbo.

**How it works:**
1. Checks if `OPENAI_API_KEY` is set in `.env` (already configured)
2. If available, uses OpenAI to generate personalized, motivating career summaries
3. Falls back to template-based summaries if API is unavailable or fails
4. Considers user's current skills, role, and growth priorities

**AI Prompt includes:**
- Current role and target role
- Timeline (e.g., "Q3 2025")
- Long-term career goal
- User's current skills from database
- Focus areas/growth priorities

### 3. Frontend Updates (`client/pages/career.js`)

#### Data Fetching
- Fetches career path data on page load using `apiClient.getCareerPath()`
- Displays real data from database instead of hardcoded values
- Gracefully handles missing data with fallbacks

#### Dynamic UI Elements

**Skills Analysis Section:**
- Shows user's actual role: "Based on your current role: [Backend Developer]"
- Displays growth priorities from backend with dynamic progress bars
- Each priority shows skill name, current percentage, and color-coded progress

**Recommended Internal Roles:**
- Displays up to 2 recommended roles from backend
- Shows match percentage with color coding (green ≥85%, orange ≥70%)
- Includes role title, description, and department
- Falls back to default card if no data available

**Next Career Milestone:**
- Current role from database
- Next role with estimated date (e.g., "EST. Q3 2025")
- Future role for long-term planning
- All data pulled from backend career path

**Edit Roadmap Modal:**
- Pre-fills form with data from backend
- Uses user's actual role and recommended next steps
- Passes growth priorities to AI for personalized narrative
- Generates AI-powered summary when opened

### 4. API Client Updates (`client/utils/apiClient.js`)

Added new method:
```javascript
async getCareerPath() {
  // GET /api/career/path
  // Returns personalized career data for current user
}
```

## How to Use

### For Employees
1. Navigate to Career Path page (`/career`)
2. View personalized career recommendations based on your role
3. See your growth priorities and skill gaps
4. Explore recommended internal roles matched to your profile
5. Click "Edit Roadmap" to get AI-generated career guidance

### For Admins
To customize career paths for different roles:

1. Edit `server/career.py`
2. Update the `CAREER_PATHS` dictionary with new roles
3. Add recommended roles, milestones, and growth priorities
4. Restart backend server

**Example:**
```python
"Product Manager": {
    "next_roles": [
        {"title": "Senior Product Manager", "department": "Product", "match": 90, "description": "..."},
        # Add more roles
    ],
    "milestone": {"role": "Senior PM", "date": "Q2 2026", "future": "VP of Product"},
    "priorities": [
        {"skill": "Strategy", "current": 70, "target": 90, "color": "#4285F4"},
        # Add more priorities
    ],
}
```

## Database Fields Used

The career path integration reads from the `users` table:
- `role` - Employee's current job title (e.g., "Backend Developer")
- `experience` - Years of experience (integer)
- `skills` - Comma-separated list of skills (e.g., "Python, FastAPI, SQL")

**To update employee data:**
1. Admin can update via admin panel
2. Or directly in database: `UPDATE users SET role='Backend Developer', experience=3, skills='Python, FastAPI, SQL' WHERE email='user@zenx.com'`

## OpenAI Configuration

The OpenAI API key is already configured in `.env`:
```
OPENAI_API_KEY=sk-proj-...
```

**Features:**
- Generates personalized 2-3 sentence career summaries
- Considers user's role, skills, and growth areas
- Provides actionable, motivating advice
- Automatically falls back to templates if API fails

**Cost:** Uses GPT-3.5-turbo (cost-effective, ~$0.002 per request)

## Testing

1. **Restart Backend Server** (required for changes to take effect):
   ```bash
   cd server
   python main.py
   ```

2. **Test with Different Roles:**
   - Login as a user
   - Admin updates user's role to "Backend Developer"
   - Navigate to `/career`
   - Should see Backend Developer career path

3. **Test AI Generation:**
   - Click "Edit Roadmap" button
   - Should see AI-generated summary (if OpenAI key is valid)
   - Try editing milestone fields and click "Update summary"

## Troubleshooting

### Career data not showing
- Ensure backend server is restarted after code changes
- Check browser console for API errors
- Verify user has a `role` set in database

### AI summary not generating
- Check `.env` has valid `OPENAI_API_KEY`
- Verify OpenAI API key is active and has credits
- Check backend logs for OpenAI errors
- System will automatically fall back to template if AI fails

### Recommended roles not appearing
- User's role must match one in `CAREER_PATHS` dictionary
- Or will use "default" career path
- Add custom career paths in `server/career.py`

## Future Enhancements

Potential improvements:
1. Add more role-specific career paths
2. Machine learning to predict best career matches
3. Integration with internal job postings
4. Skills gap analysis with learning recommendations
5. Mentor matching based on career goals
6. Track career progression over time

## Files Modified

- `server/career.py` - Enhanced with DB integration and AI
- `client/pages/career.js` - Updated to use backend data
- `client/utils/apiClient.js` - Added getCareerPath method
- `server/.env` - Already has OPENAI_API_KEY configured

## Summary

The Career Path page now provides:
✅ Real-time data from employee database
✅ AI-powered career guidance using OpenAI
✅ Personalized role recommendations
✅ Dynamic skill gap analysis
✅ Career milestone tracking
✅ Graceful fallbacks for missing data

All changes are backward compatible and handle edge cases gracefully.
