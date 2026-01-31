# 🔧 Fix Database Error - "no such column: users.manager_id"

## ❌ Error You're Seeing

```
sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) no such column: users.manager_id
ERROR: Application startup failed. Exiting.
```

## 🎯 What's Happening

The database schema has been updated with new columns (`manager_id`, `manager_email`, `is_manager`), but your old database file doesn't have these columns.

## ✅ Solution (2 Steps)

### **Step 1: Stop the Backend**

In the terminal where `python main.py` is running:
1. Press `Ctrl+C` to stop the server
2. Wait for it to fully stop

### **Step 2: Delete the Old Database**

**Option A: Using File Explorer**
1. Navigate to: `C:\Users\AmirMahboob(G10XIND)\OneDrive - G10X Technology Private Limited\Desktop\CtrlSCrew\CtrlSCrew\server`
2. Find the file: `employee_portal.db`
3. Delete it

**Option B: Using PowerShell** (in the `server` folder)
```powershell
Remove-Item employee_portal.db
```

### **Step 3: Restart the Backend**

```bash
cd server
python main.py
```

**Expected Output** (Success!):
```
Database initialized successfully
Default admin created: admin@zenx.com / admin123
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## 🎉 Done!

The database will be recreated with all the new columns and tables:
- ✅ `users` table with manager fields
- ✅ `leave_balance` table
- ✅ `leave_requests` table
- ✅ `attendance` table
- ✅ `holidays` table
- ✅ All other tables

---

## ⚠️ Important Notes

1. **You will lose existing data** when you delete the database
   - All users (except admin) will be deleted
   - All payroll records will be deleted
   - This is expected for development!

2. **Admin account will be recreated automatically**
   - Email: `admin@zenx.com`
   - Password: `admin123`

3. **After restart, you need to**:
   - Login as admin
   - Click "Initialize Leave Balances" button
   - Create test users again (if needed)

---

## 🚀 Quick Commands

If you're in the project root:

```bash
# Stop backend (Ctrl+C in the terminal)
# Then run:
cd server
Remove-Item employee_portal.db
python main.py
```

---

## ✅ How to Verify It's Fixed

You should see:
```
Database initialized successfully
Default admin created: admin@zenx.com / admin123
INFO:     Started server process [XXXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**No more errors!** 🎉

---

## 🆘 Still Having Issues?

If you still see errors after deleting the database:

1. Make sure the backend is fully stopped (no `python main.py` running)
2. Check if `employee_portal.db` is really deleted
3. Try restarting your terminal
4. Make sure you're in the `server` folder when running `python main.py`

---

**This is a one-time fix!** Once the database is recreated, everything will work smoothly.
