# 🚀 Quick Start Guide - Admin System

## Step 1: Restart Backend Server

```bash
# Stop current server (Ctrl+C)
cd server
python main.py
```

**Expected Output:**
```
Database initialized successfully
Default admin created: admin@zenx.com / admin123
```

## Step 2: Login as Admin

1. Go to: `http://localhost:3000/login`
2. Enter:
   - **Email:** `admin@zenx.com`
   - **Password:** `admin123`
3. Click "Login"
4. You'll be redirected to: `http://localhost:3000/admin`

## Step 3: Create a User

1. Click "**+ Add New User**"
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `test123`
   - Role: `Regular User`
3. Click "**Create User**"

## Step 4: Test User Login

1. Logout
2. Login with:
   - Email: `test@example.com`
   - Password: `test123`
3. User will see dashboard

## ✅ Done!

Your admin system is working!

---

## Default Credentials

**Admin:**
- Email: `admin@zenx.com`
- Password: `admin123`

⚠️ **Change this password immediately!**

---

## Key URLs

- **Login:** `http://localhost:3000/login`
- **Admin Panel:** `http://localhost:3000/admin`
- **User Dashboard:** `http://localhost:3000/dashboard`
- **API Docs:** `http://localhost:8000/docs`

---

## Troubleshooting

**Can't login as admin?**
→ Delete `server/employee_portal.db` and restart server

**Database error?**
→ Stop server, delete database, restart

**Need help?**
→ Read `ADMIN_SETUP.md` or `IMPLEMENTATION_SUMMARY.md`
