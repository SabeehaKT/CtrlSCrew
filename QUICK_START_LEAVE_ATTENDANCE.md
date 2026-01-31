# 🚀 Quick Start Guide - Leave & Attendance System

## ⚡ Get Started in 5 Minutes!

---

## Step 1: Restart Backend (IMPORTANT!)

The database schema has been updated. You need to restart the backend:

### **Option A: If Backend is Running**
1. Go to the terminal running `uvicorn`
2. Press `Ctrl+C` to stop
3. Delete the database: `del employee_portal.db` (in `server` folder)
4. Restart: `python main.py`

### **Option B: Fresh Start**
```bash
cd server
del employee_portal.db
python main.py
```

**Expected Output**:
```
Database initialized successfully
Default admin created: admin@zenx.com / admin123
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## Step 2: Start Frontend

```bash
cd client
npm run dev
```

**Expected Output**:
```
ready - started server on 0.0.0.0:3000
```

---

## Step 3: Initialize Leave Balances (One-Time Setup)

### **Login as Admin**
1. Go to `http://localhost:3000`
2. Login with:
   - Email: `admin@zenx.com`
   - Password: `admin123`

### **Initialize Leave Balances**
1. You'll be on the Admin Panel
2. Click the **"Initialize Leave Balances"** button (yellow)
3. Wait for success message: "Initialized leave balances for X users"
4. ✅ Done! All users now have leave balances

**Default Leave Allocation**:
- Earned Leave: 21 days
- Casual Leave: 7 days
- Sick Leave: 14 days
- Comp Off: 0 days

---

## Step 4: Test Employee Flow

### **Create a Test User** (if needed)
1. In Admin Panel, click **"Add New User"**
2. Fill in details:
   - Name: Test Employee
   - Email: test@zenx.com
   - Password: test123
   - Role: Developer
3. Click **"Add User"**

### **Login as Employee**
1. Logout from admin
2. Login with test user credentials
3. You'll see the Dashboard

### **View Leave Balance**
On the dashboard, you'll see:
```
LEAVE BALANCE
Earned Leave: 21 / 21 Days
Casual Leave: 7 / 7 Days
Sick Leave: 14 / 14 Days
```

### **Apply for Leave**
1. Go to `http://localhost:3000/apply-leave` (or add a button to dashboard)
2. Fill the form:
   - Leave Type: Earned Leave
   - Start Date: Tomorrow
   - End Date: Day after tomorrow
   - Days: 2 (auto-calculated)
   - Reason: "Personal work"
3. Click **"Submit Request"**
4. ✅ Success! You'll be redirected to dashboard

---

## Step 5: Test Admin Approval

### **Login as Admin Again**
1. Logout from employee account
2. Login as admin

### **View Leave Requests**
1. Click **"Leave Requests"** button (blue)
2. You'll see the test employee's leave request
3. Status: **PENDING** (orange chip)

### **Approve the Leave**
1. Click the green **"Approve"** button
2. ✅ Success! Status changes to **APPROVED** (green chip)
3. Employee's leave balance is automatically deducted

### **Check Leave Balance**
1. Go back to Admin Panel
2. The employee now has:
   - Earned Leave: 19 / 21 Days (2 days deducted!)

---

## Step 6: Test Attendance Management

### **Mark Attendance**
1. Click **"Manage Attendance"** button (green)
2. Select today's date
3. Click **"Mark All Present"** (green button)
4. ✅ All employees marked as present!

### **Override Individual Attendance**
1. Find the test employee in the table
2. Change status dropdown to **"Leave"**
3. Select leave type: **"Casual Leave"**
4. ✅ Updated! Casual leave balance will be deducted

---

## 🎯 Quick Reference

### **URLs**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### **Admin Credentials**
- Email: `admin@zenx.com`
- Password: `admin123`

### **Admin Pages**
- Admin Panel: `/admin`
- Payroll: `/admin/payroll`
- Leave Requests: `/admin/leave-requests`
- Attendance: `/admin/attendance`

### **Employee Pages**
- Dashboard: `/dashboard`
- Apply Leave: `/apply-leave`
- Profile: `/profile`
- Change Password: `/change-password`

---

## 🐛 Troubleshooting

### **Problem: "Leave balance not found"**
**Solution**: Admin needs to click "Initialize Leave Balances" button

### **Problem: "No payroll records found"**
**Solution**: Admin needs to create payroll records in `/admin/payroll`

### **Problem: Backend not starting**
**Solution**: 
1. Make sure you're in the `server` folder
2. Check if virtual environment is activated
3. Run `pip install -r requirements.txt`

### **Problem: Frontend not loading**
**Solution**:
1. Make sure you're in the `client` folder
2. Run `npm install`
3. Check if backend is running on port 8000

### **Problem: Database errors**
**Solution**:
1. Stop backend (Ctrl+C)
2. Delete `employee_portal.db`
3. Restart backend

---

## ✅ Success Checklist

After following this guide, you should be able to:

- ✅ See dynamic leave balance on dashboard
- ✅ Apply for leave as employee
- ✅ View leave requests as admin
- ✅ Approve/reject leave requests
- ✅ Mark attendance (bulk + individual)
- ✅ See leave balance auto-deduct

---

## 🎉 You're All Set!

The basic leave and attendance system is now fully functional. 

**Next Steps**:
- Add more users
- Test different leave types
- Mark attendance for different dates
- Explore the system!

**Need Help?** Check `BASIC_IMPLEMENTATION_COMPLETE.md` for detailed documentation.

---

## 📝 Quick Tips

1. **Always initialize leave balances** for new users (or click the button again)
2. **LOP (Loss of Pay)** doesn't require leave balance
3. **Half Day** deducts 0.5 days from leave balance
4. **Bulk actions** override existing attendance records
5. **Individual overrides** are saved immediately

---

Happy Managing! 🚀
