# ⚡ QUICK START: Add Your OpenAI API Key

## 🎯 Step 1: Get API Key
1. Visit: https://platform.openai.com/api-keys
2. Create account / Sign in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-...` or `sk-...`)

## 🔧 Step 2: Add to Project

**PASTE YOUR API KEY HERE:**

File: `server/.env` (line 13)

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Replace `your-openai-api-key-here` with your actual key.

## 🚀 Step 3: Restart Backend

```bash
# Stop current backend (Ctrl+C in terminal)

# Restart
cd server
python main.py
```

## ✅ Done!

The AI course recommendation system is now ready.

---

## 📡 How to Use

### API Endpoint
```
GET /api/user/course-recommendations
```

### Authentication
Requires JWT token (Bearer token in Authorization header)

### Example Response
```json
{
  "success": true,
  "employee_name": "John Doe",
  "recommendations": [
    {
      "title": "Advanced Python Programming",
      "priority": 1,
      "reason": "Perfect for advancing your Python skills...",
      "skills": ["Python", "OOP"],
      "level": "Advanced",
      "course_url": "https://..."
    }
    // ... 4 more courses
  ]
}
```

---

## 🔍 How It Works

1. **Employee Profile** → Skills, Role, Experience, Interests
2. **Pre-filtering** → Narrows 100+ courses to top 15 most relevant
3. **AI Ranking (GPT-4o)** → Ranks and explains top 5 recommendations
4. **Returns** → Prioritized courses with detailed reasons

---

## 💡 What Was Implemented

✅ **Backend Files Created:**
- `server/course_recommendation.py` - AI recommendation engine
- `server/.env` - Added OPENAI_API_KEY field
- `server/config.py` - Updated to load API key
- `server/routes.py` - Added `/course-recommendations` endpoint
- `server/requirements.txt` - Added openai package

✅ **Features:**
- Smart pre-filtering (skill gap analysis, role matching)
- GPT-4o AI ranking with explanations
- JWT authentication
- Cost-optimized (only ~$0.01 per request)

✅ **Data Source:**
- Uses `server/linkedin_courses.json` (already exists)
- No external course search needed

---

## 📝 Important Notes

⚠️ **Security:**
- NEVER commit `.env` to Git
- Keep API key secret
- `.env` is already in `.gitignore`

💰 **Costs:**
- ~$0.01 per recommendation request
- ~$2/month for 200 requests
- Monitor usage at: https://platform.openai.com/usage

🧪 **Testing:**
1. Login as employee
2. Make request to `/api/user/course-recommendations`
3. Should return 5 personalized course recommendations

---

## 📖 Full Documentation

See: `server/AI_COURSE_RECOMMENDATIONS_SETUP.md` for complete guide

---

## 🆘 Quick Troubleshooting

**Error: "Invalid API key"**
→ Check `.env` file, restart backend

**Error: "No module named 'openai'"**
→ Run: `pip install openai==1.58.1`

**No recommendations returned**
→ Check employee has: role, skills, experience, interests filled

---

## ✨ You're All Set!

Just add your OpenAI API key and restart the backend! 🚀
