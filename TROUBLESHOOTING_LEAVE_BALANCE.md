# 🔧 Troubleshooting Leave Balance Display Issue

## ❌ Problem
Leave balance bar is full and no numbers are showing, or deducted numbers aren't appearing.

---

## ✅ Solution Steps

### **Step 1: Restart Backend (IMPORTANT!)**

The schema was just updated. You MUST restart the backend:

1. **Stop the backend**: Press `Ctrl+C` in the terminal running `python main.py`
2. **Restart**: Run `python main.py` again

**Why?** The backend needs to reload the updated schema that now properly calculates remaining leave days.

---

### **Step 2: Check if Leave Balance is Initialized**

1. Login as **admin**: `admin@zenx.com` / `admin123`
2. Click **"Initialize Leave Balances"** button (yellow button)
3. You should see: "Leave balances initialized for X users"

**Why?** Without this, users have NO leave balance records in the database.

---

### **Step 3: Hard Refresh the Dashboard**

1. Go to the user dashboard
2. Press `Ctrl+F5` (or `Ctrl+Shift+R` on Mac)
3. This clears the cache and fetches fresh data

---

### **Step 4: Check Browser Console for Errors**

1. Open browser DevTools (Press `F12`)
2. Go to **Console** tab
3. Look for any red errors
4. Go to **Network** tab
5. Refresh the page
6. Find the request to `/api/leave/balance`
7. Click on it and check the **Response** tab

**Expected Response**:
```json
{
  "id": 1,
  "user_id": 2,
  "earned_leave_total": 21.0,
  "earned_leave_used": 0.0,
  "casual_leave_total": 7.0,
  "casual_leave_used": 0.0,
  "sick_leave_total": 14.0,
  "sick_leave_used": 0.0,
  "comp_off_total": 0.0,
  "comp_off_used": 0.0,
  "year": 2026,
  "earned_leave_remaining": 21.0,
  "casual_leave_remaining": 7.0,
  "sick_leave_remaining": 14.0,
  "comp_off_remaining": 0.0
}
```

**If you see this**, the backend is working correctly!

---

### **Step 5: Test Leave Deduction**

#### **Method A: Via Leave Request**
1. Login as employee
2. Go to `/apply-leave` (or click "Apply Leave" button)
3. Apply for 2 days of Earned Leave
4. Logout, login as admin
5. Go to `/admin/leave-requests`
6. Click **"Approve"**
7. Logout, login as employee
8. Check dashboard → Should show `19 / 21 Days` ✅

#### **Method B: Via Attendance**
1. Login as admin
2. Go to `/admin/attendance`
3. Select today's date
4. Click **"Mark All Present"**
5. Find a user, change status to **"Leave"**
6. Select leave type: **"Casual Leave"**
7. Login as that user
8. Check dashboard → Should show `6 / 7 Days` for Casual Leave ✅

---

## 🐛 Common Issues & Fixes

### **Issue 1: "Leave balance not found"**
**Cause**: Leave balance not initialized  
**Fix**: Admin must click "Initialize Leave Balances" button

### **Issue 2: Numbers show as "undefined" or "NaN"**
**Cause**: Backend not restarted after schema update  
**Fix**: Restart backend (`Ctrl+C` then `python main.py`)

### **Issue 3: Progress bar is full but numbers are correct**
**Cause**: Division by zero or incorrect calculation  
**Fix**: Check browser console for JavaScript errors

### **Issue 4: Old data still showing**
**Cause**: Browser cache  
**Fix**: Hard refresh (`Ctrl+F5`)

### **Issue 5: API returns 404**
**Cause**: Backend routes not registered  
**Fix**: Check `server/main.py` has `leave_router` included

---

## 🔍 Debug Checklist

Run through this checklist:

- [ ] Backend is running without errors
- [ ] Backend was restarted after schema update
- [ ] Leave balances are initialized (admin clicked the button)
- [ ] User has a leave balance record in database
- [ ] Browser cache cleared (hard refresh)
- [ ] No errors in browser console
- [ ] API `/api/leave/balance` returns correct data
- [ ] `earned_leave_remaining` field exists in API response

---

## 📊 Expected Behavior

### **Initial State** (After initialization):
```
Earned Leave: 21 / 21 Days  [████████████████████] 100%
Casual Leave: 7 / 7 Days    [████████████████████] 100%
Sick Leave: 14 / 14 Days    [████████████████████] 100%
```

### **After 2 Days Deduction**:
```
Earned Leave: 19 / 21 Days  [█████████████████░░░] 90%
Casual Leave: 7 / 7 Days    [████████████████████] 100%
Sick Leave: 14 / 14 Days    [████████████████████] 100%
```

---

## 🚀 Quick Test Command

To verify the backend is working, you can test the API directly:

1. Login to get a token
2. Open browser DevTools → Console
3. Run:
```javascript
fetch('http://localhost:8000/api/leave/balance', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log(d))
```

This will show you the exact API response.

---

## ✅ If Everything is Working

You should see:
- ✅ Numbers displayed correctly (e.g., "21 / 21 Days")
- ✅ Progress bars showing correct percentage
- ✅ Numbers update after leave approval
- ✅ No errors in console

---

## 🆘 Still Not Working?

If you've tried all the above and it's still not working:

1. **Check backend terminal** for any errors
2. **Check frontend terminal** for any build errors
3. **Share the API response** from the Network tab
4. **Share any console errors** from the browser

The most common fix is: **Restart the backend!** 🔄
