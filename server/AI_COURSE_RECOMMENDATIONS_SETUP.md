# AI Course Recommendation System - Setup Guide

## 📍 Where to Add Your OpenAI API Key

### Step 1: Get Your OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (it starts with `sk-...`)

### Step 2: Add the API Key to Your Environment

Open the file: `server/.env`

Find this line:
```
OPENAI_API_KEY=your-openai-api-key-here
```

Replace `your-openai-api-key-here` with your actual API key:
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **IMPORTANT**: Never commit your `.env` file to Git! It's already in `.gitignore`.

---

## 🏗️ System Architecture

### How It Works

1. **Employee visits learning page**
   - Frontend calls `/api/user/course-recommendations`
   - Sends JWT token for authentication

2. **Backend pre-filters courses**
   ```
   All Courses (linkedin_courses.json)
        ↓
   [Smart Filtering]
        ↓
   Top 15 Relevant Courses
        ↓
   [OpenAI AI Ranking]
        ↓
   Top 5 Recommendations with Reasons
   ```

3. **Filtering Logic**
   - **Skill Gap Analysis**: Courses teaching skills employee doesn't have
   - **Role Relevance**: Matches course category with employee role
   - **Interest Match**: Aligns with employee's areas of interest
   - **Experience Level**: Beginner/Intermediate/Advanced matching

4. **AI Ranking (GPT-4o)**
   - Analyzes employee profile
   - Ranks filtered courses by priority
   - Provides detailed reasons for each recommendation

---

## 📁 File Structure

```
server/
├── .env                          # ⭐ ADD YOUR API KEY HERE
├── config.py                     # Loads OPENAI_API_KEY
├── linkedin_courses.json         # Course database
├── course_recommendation.py      # AI recommendation engine
├── routes.py                     # API endpoint: GET /api/user/course-recommendations
└── requirements.txt              # Includes openai==1.58.1
```

---

## 🔧 API Endpoint

### GET `/api/user/course-recommendations`

**Authentication**: Requires JWT token

**Response Example**:
```json
{
  "success": true,
  "employee_name": "John Doe",
  "employee_role": "Software Engineer",
  "total_courses_analyzed": 15,
  "recommendations": [
    {
      "title": "Advanced Python Programming",
      "skills": ["Python", "OOP", "Design Patterns"],
      "category": "Programming",
      "level": "Advanced",
      "course_url": "https://linkedin.com/learning/...",
      "priority": 1,
      "reason": "This course addresses your need to advance Python skills from intermediate to expert level, particularly focusing on design patterns which is crucial for senior engineering roles."
    },
    {
      "title": "Machine Learning Fundamentals",
      "priority": 2,
      "reason": "Based on your interest in AI and current Python expertise, this course will provide a strong foundation for transitioning into ML engineering."
    }
    // ... 3 more courses
  ]
}
```

---

## 🧪 Testing the System

### 1. Create Test Employee Profile

Login as admin (`admin@zenx.com` / `admin123`) and create an employee with:
```
Name: Test User
Email: test@company.com
Password: test123
Role: Software Engineer
Experience: 3 years
Skills: Python, JavaScript, React
Area of Interest: Machine Learning, Cloud Computing
```

### 2. Test the API

```bash
# Login as the employee
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@company.com","password":"test123"}'

# Copy the access_token from response

# Get course recommendations
curl -X GET http://localhost:8000/api/user/course-recommendations \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Expected Behavior

✅ System should:
- Pre-filter courses based on profile
- Send top 15 to OpenAI
- Return 5 prioritized recommendations
- Each with detailed reasoning

❌ If you see errors:
- "No module named 'openai'" → Run `pip install openai==1.58.1`
- "Invalid API key" → Check your `.env` file
- "No courses available" → Ensure `linkedin_courses.json` exists

---

## 💰 Cost Estimation

### GPT-4o Pricing (as of 2024)
- Input: $2.50 per 1M tokens
- Output: $10.00 per 1M tokens

### Per Request Cost
- **Input tokens**: ~3,000 tokens (profile + 15 courses)
- **Output tokens**: ~800 tokens (5 recommendations with reasons)
- **Cost per request**: ~$0.01 USD

### Monthly Cost (100 employees, 2 requests each)
- 200 requests × $0.01 = **$2.00/month**

---

## 🔒 Security Best Practices

1. ✅ **Never commit `.env` to Git**
2. ✅ **Use environment variables for API keys**
3. ✅ **Validate JWT tokens before allowing recommendations**
4. ✅ **Rate limit the recommendations endpoint** (optional)

---

## 🐛 Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'openai'"
**Solution**: 
```bash
cd server
pip install openai==1.58.1
```

### Issue: "AuthenticationError: Invalid API key"
**Solution**: 
1. Check `.env` file has correct key format: `sk-proj-...`
2. Verify key is active at https://platform.openai.com/api-keys
3. Restart backend server after updating `.env`

### Issue: "No courses available"
**Solution**: 
Ensure `server/linkedin_courses.json` exists and contains valid course data.

### Issue: AI recommendations not relevant
**Solution**: 
1. Check employee profile has detailed:
   - Role
   - Skills (comma-separated)
   - Experience (in years)
   - Area of Interest (comma-separated)
2. Add more courses to `linkedin_courses.json`

---

## 📊 Customization

### Adjust Number of Recommendations

In `course_recommendation.py`, line ~185:
```python
for rec in recommendations[:5]:  # Change 5 to desired number
```

### Change AI Model

In `course_recommendation.py`, line ~126:
```python
model="gpt-4o",  # Options: "gpt-4", "gpt-4-turbo", "gpt-4o"
```

### Adjust Pre-filtering Logic

In `course_recommendation.py`, lines 30-80, modify relevance scoring:
```python
# Increase/decrease scoring weights
skill_gap: relevance_score += len(skill_gap) * 2  # Change multiplier
role_relevance: relevance_score += 3  # Change points
```

---

## 🚀 Next Steps

1. ✅ Add your OpenAI API key to `.env`
2. ✅ Restart backend server
3. ✅ Create employee profiles with detailed info
4. ✅ Test the `/course-recommendations` endpoint
5. 🎨 Build frontend learning page to display recommendations

---

## 📝 Notes

- **Token Usage**: The system minimizes costs by pre-filtering courses before sending to OpenAI
- **Response Time**: Typically 2-5 seconds per request
- **Caching**: Consider caching recommendations for 24 hours per user
- **Course Database**: Update `linkedin_courses.json` regularly with new courses

---

## ✅ Checklist

Before going live:
- [ ] OpenAI API key added to `.env`
- [ ] `openai` package installed
- [ ] `linkedin_courses.json` populated with courses
- [ ] Backend server restarted
- [ ] Test recommendation endpoint working
- [ ] Employee profiles have detailed information
- [ ] Monitor API usage on OpenAI dashboard
