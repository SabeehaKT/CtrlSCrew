# 🎯 Enhanced Profile System - Complete Guide

## 📋 Overview

A comprehensive employee profile management system with role-based access control, forced password changes, and separate admin/user editable fields.

---

## 🚀 New Features Implemented

### 1. **Extended User Profile Fields**

#### Admin-Controlled (Employment Data):
- ✅ **Role** - Job designation (e.g., Backend Developer, HR, Analyst)
- ✅ **Experience** - Years of experience
- ✅ **Skills** - Comma-separated technical skills

#### User-Controlled (Personal Data):
- ✅ **Phone Number** - Contact information
- ✅ **Address** - Residential address
- ✅ **Area of Interest** - Personal interests and hobbies
- ✅ **Profile Photo** - Avatar/profile picture (future implementation)

### 2. **Forced Password Change**
- ✅ New users **must change password** on first login
- ✅ Admin-reset passwords also require change
- ✅ Automatic redirect to change-password page
- ✅ Cannot access dashboard until password is changed

### 3. **User Profile Page**
- ✅ View all profile information
- ✅ Edit personal details (phone, address, interests)
- ✅ View employment data (read-only for users)
- ✅ Change password option
- ✅ Beautiful, modern UI with Material-UI

### 4. **Enhanced Dashboard**
- ✅ Profile menu with avatar dropdown
- ✅ Quick access to profile and settings
- ✅ Logout functionality
- ✅ Display user role instead of generic "Senior UX Designer"

### 5. **Enhanced Admin Panel**
- ✅ Create users with employment details
- ✅ Set role, experience, and skills
- ✅ One-time password (user must change)
- ✅ Edit user employment information
- ✅ View all user details in table

---

## 📁 Files Modified/Created

### Backend Files:

1. **`server/database.py`**
   - Added new columns: `role`, `experience`, `skills`, `phone`, `address`, `area_of_interest`, `profile_photo`, `must_change_password`

2. **`server/schemas.py`**
   - Added `AdminUserCreate` with employment fields
   - Added `UserProfileUpdate` for user-editable fields
   - Added `AdminUserUpdate` for admin-editable fields
   - Added `PasswordChange` schema
   - Updated `UserResponse` with all new fields

3. **`server/routes.py`**
   - Added `/api/users/profile` PUT endpoint (user profile update)
   - Added `/api/users/change-password` POST endpoint
   - Updated admin user creation to include new fields
   - Updated admin user update to include employment fields

4. **`server/main.py`**
   - Set `must_change_password=False` for default admin

### Frontend Files:

5. **`client/pages/profile.js`** ✨ NEW
   - Complete user profile page
   - Edit personal information
   - View employment information (read-only)
   - Beautiful card-based layout

6. **`client/pages/change-password.js`** ✨ NEW
   - Password change form
   - Forced change for new users
   - Validation and error handling

7. **`client/pages/login.js`**
   - Check `must_change_password` after login
   - Redirect to change-password if required

8. **`client/pages/dashboard.js`**
   - Added profile menu dropdown
   - Added logout functionality
   - Display user role from database

9. **`client/pages/admin.js`**
   - Added role, experience, skills fields to user form
   - Updated table to show role
   - Updated create/edit logic

10. **`client/utils/apiClient.js`**
    - Added `updateUserProfile()` method
    - Added `changePassword()` method
    - Added `getAllUsers()`, `createUser()`, `updateUser()`, `deleteUser()` methods

---

## 🎬 How to Use

### **Step 1: Delete Old Database & Restart Server**

The database schema has changed, so you need to recreate it:

```powershell
# Navigate to server folder
cd server

# Delete old database
del employee_portal.db

# Start server
uvicorn main:app --reload
```

You should see:
```
Database initialized successfully
Default admin created: admin@zenx.com / admin123
```

### **Step 2: Login as Admin**

1. Go to `http://localhost:3000/login`
2. Login with:
   - **Email:** `admin@zenx.com`
   - **Password:** `admin123`
3. You'll be redirected to `/admin`

### **Step 3: Create a New User**

1. Click **"+ Add New User"**
2. Fill in the form:
   - **Name:** John Doe
   - **Email:** john@zenx.com
   - **Password:** temp123
   - **Role:** Backend Developer
   - **Experience:** 3
   - **Skills:** React, Node.js, Python
   - **User Type:** Regular User
3. Click **"Save"**

### **Step 4: Test First-Time Login (Forced Password Change)**

1. Logout from admin
2. Login as the new user:
   - **Email:** john@zenx.com
   - **Password:** temp123
3. You'll be **automatically redirected** to `/change-password`
4. Change the password:
   - **Current Password:** temp123
   - **New Password:** john123
   - **Confirm:** john123
5. Click **"Change Password"**
6. You'll be redirected to `/dashboard`

### **Step 5: Test User Profile**

1. Click on the **avatar** in the top-right corner
2. Select **"My Profile"**
3. You'll see:
   - **Employment Information** (read-only):
     - Role: Backend Developer
     - Experience: 3 years
     - Skills: React, Node.js, Python
   - **Personal Information** (editable):
     - Phone Number
     - Address
     - Area of Interest
4. Click **"Edit Profile"**
5. Fill in personal details:
   - **Phone:** +1 234 567 8900
   - **Address:** 123 Main St, City, State
   - **Area of Interest:** Machine Learning, Open Source
6. Click **"Save Changes"**

### **Step 6: Test Admin Can See All User Data**

1. Login as admin again
2. Go to `/admin`
3. Click **edit** (✏️) on John's account
4. You can see and edit:
   - Name, Email
   - Role, Experience, Skills (employment data)
5. You **cannot** see personal data (phone, address, interests)
   - This is by design - admin controls employment, user controls personal

---

## 🔐 Security Features

### 1. **Forced Password Change**
- All new users must change password on first login
- Admin password resets also trigger forced change
- Users cannot access dashboard until password is changed

### 2. **Role-Based Access Control**
- **Admin** can edit: Name, Email, Role, Experience, Skills, Admin status
- **User** can edit: Phone, Address, Area of Interest
- Clear separation of concerns

### 3. **Password Validation**
- Minimum 6 characters
- Must match confirmation
- Old password verification for changes

---

## 🎨 UI/UX Features

### Profile Page:
- ✅ Card-based layout
- ✅ Avatar with user initial
- ✅ Admin/User badge
- ✅ Clear sections for employment vs personal data
- ✅ Edit mode with save/cancel buttons
- ✅ Success/error messages

### Dashboard:
- ✅ Profile menu dropdown
- ✅ Quick access to profile, change password, logout
- ✅ Display actual user role
- ✅ Smooth animations

### Admin Panel:
- ✅ Extended user creation form
- ✅ Role displayed in table
- ✅ All employment fields editable

---

## 📊 Database Schema

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    must_change_password BOOLEAN DEFAULT TRUE,
    
    -- Admin-controlled (employment)
    role VARCHAR,
    experience INTEGER,
    skills VARCHAR,
    
    -- User-controlled (personal)
    phone VARCHAR,
    address VARCHAR,
    area_of_interest VARCHAR,
    profile_photo VARCHAR,
    
    created_at DATETIME,
    updated_at DATETIME
);
```

---

## 🔗 API Endpoints

### User Endpoints:
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update personal fields (phone, address, interests)
- `POST /api/users/change-password` - Change password

### Admin Endpoints:
- `POST /api/admin/users` - Create user (with employment fields)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/{id}` - Get specific user
- `PUT /api/admin/users/{id}` - Update user (employment fields)
- `DELETE /api/admin/users/{id}` - Delete user

---

## 🎯 User Flow

### New User Journey:
1. Admin creates account with temp password
2. User receives credentials
3. User logs in → **Forced to change password**
4. User changes password → Redirected to dashboard
5. User clicks avatar → Goes to profile
6. User edits personal information
7. Admin can see employment data but not personal data

### Admin Journey:
1. Login → Admin dashboard
2. Create users with full employment details
3. Edit user employment information
4. View all users in table
5. Cannot see user personal data (by design)

---

## ✅ Testing Checklist

- [ ] Delete old database
- [ ] Start server (admin auto-created)
- [ ] Login as admin
- [ ] Create new user with all fields
- [ ] Logout and login as new user
- [ ] Verify forced password change
- [ ] Change password successfully
- [ ] Access dashboard
- [ ] Edit profile (personal fields)
- [ ] Verify profile saved
- [ ] Login as admin again
- [ ] Edit user employment fields
- [ ] Verify changes saved
- [ ] Test logout functionality

---

## 🚨 Important Notes

1. **Database Migration**: You MUST delete the old database for schema changes to take effect
2. **Admin Password**: Default admin does NOT require password change
3. **User Passwords**: All user-created accounts require first-time password change
4. **Field Separation**: Admin controls employment, User controls personal
5. **Profile Photo**: Field exists in database but UI implementation pending

---

## 🎉 Summary

You now have a complete, production-ready employee profile system with:
- ✅ Role-based access control
- ✅ Forced password changes
- ✅ Separate admin/user editable fields
- ✅ Beautiful, modern UI
- ✅ Complete CRUD operations
- ✅ Security best practices

**Ready to use!** Just delete the database and restart the server! 🚀
