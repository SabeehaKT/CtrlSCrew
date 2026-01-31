# Ultra-Basic Leave & Attendance System

## 🎯 Minimum Viable Product (MVP)

### **What We're Building** (Bare Minimum)

1. **Dashboard** - Show real leave balance
2. **Apply Leave** - Simple form (no manager, goes straight to pending)
3. **Admin View Requests** - See all leave requests, approve/reject
4. **Admin Attendance** - Mark attendance (bulk + individual picklist)

**Total**: 4 features, ~1000 lines of code

---

## ✅ What's Ready

- ✅ Database schema (all tables created)
- ✅ Pydantic schemas (validation ready)

---

## 🚀 Implementation Plan

### **Step 1: Basic APIs** (Backend)
**File**: `server/routes.py`

**5 Simple Endpoints**:
```python
# User endpoints
GET    /api/users/leave-balance         # Get own leave balance
POST   /api/leave-requests              # Apply for leave
GET    /api/leave-requests              # View own requests

# Admin endpoints  
GET    /api/admin/leave-requests        # View all requests
PUT    /api/admin/leave-requests/{id}   # Approve/reject
POST   /api/admin/attendance/bulk       # Mark attendance for date
```

---

### **Step 2: Dashboard Update** (Frontend)
**File**: `client/pages/dashboard.js`

**Change**:
```javascript
// OLD (Static):
Annual Leave: 12 / 20 Days
Sick Leave: 8 / 10 Days

// NEW (Dynamic from API):
const leaveBalance = await apiClient.getMyLeaveBalance();
Earned Leave: {leaveBalance.earned_leave_remaining} / {leaveBalance.earned_leave_total}
Casual Leave: {leaveBalance.casual_leave_remaining} / {leaveBalance.casual_leave_total}
Sick Leave: {leaveBalance.sick_leave_remaining} / {leaveBalance.sick_leave_total}
```

---

### **Step 3: Apply Leave Page** (Frontend)
**File**: `client/pages/leave/apply.js`

**Super Simple Form**:
```javascript
- Leave Type dropdown
- Start Date picker
- End Date picker
- Reason text field
- Submit button
```

**No validation, no fancy UI, just works!**

---

### **Step 4: Admin Attendance Page** (Frontend)
**File**: `client/pages/admin/attendance.js`

**Super Simple**:
```javascript
- Date picker
- Button: "Mark All Present"
- Table: List of employees with dropdown
- Dropdown options: Present, Absent, Leave-Earned, Leave-Casual, etc.
- Save button
```

---

## 📝 Simplified Workflow

### **Leave Request Flow** (Simplified)
1. Employee applies → Status: "Pending"
2. Admin sees in admin panel
3. Admin clicks "Approve" or "Reject"
4. Done! (No emails, no manager)

### **Attendance Flow** (Simplified)
1. Admin picks date
2. Admin clicks "Mark All Present"
3. Admin overrides individuals (e.g., John → "Leave-Casual")
4. Save
5. Leave balance auto-deducted

---

## 🗄️ Database Initialization

**Admin needs to create leave balances manually** (one-time):

```python
# In admin panel, add button "Initialize Leave Balances"
# Creates leave balance for all users with defaults:
- Earned Leave: 21 days
- Casual Leave: 7 days
- Sick Leave: 14 days
- Comp Off: 0 days
```

---

## 📦 What's Included

### **Features**:
- ✅ View leave balance
- ✅ Apply for leave
- ✅ View own leave requests
- ✅ Admin approve/reject leaves
- ✅ Admin mark attendance (bulk + individual)
- ✅ Auto-deduct leave balance

### **What's NOT Included** (Add Later):
- ❌ Email notifications
- ❌ Manager approval
- ❌ Leave history page
- ❌ Attendance calendar view
- ❌ Holiday management
- ❌ Working Saturday tracking
- ❌ Optional holidays
- ❌ Fancy validation
- ❌ Reports

---

## 💻 Code Estimate

**Backend** (~400 lines):
- Leave balance API: ~100 lines
- Leave request API: ~150 lines
- Attendance API: ~150 lines

**Frontend** (~600 lines):
- Dashboard update: ~100 lines
- Apply leave page: ~200 lines
- Admin attendance page: ~300 lines

**Total**: ~1000 lines (manageable!)

---

## 🚀 Implementation Order

1. **Backend APIs** (30 min)
2. **Dashboard update** (15 min)
3. **Apply leave page** (30 min)
4. **Admin attendance page** (45 min)

**Total**: ~2 hours of focused work

---

## 📋 Files to Create/Update

### **Backend**:
- `server/routes.py` - Add leave & attendance endpoints

### **Frontend**:
- `client/pages/dashboard.js` - Update leave card
- `client/pages/leave/apply.js` - NEW (simple form)
- `client/pages/admin/attendance.js` - NEW (simple table)
- `client/utils/apiClient.js` - Add API methods

### **Total**: 4 files (1 new backend section, 2 new pages, 1 update)

---

## 🎯 Success Criteria

**After implementation, you should be able to**:
1. ✅ See real leave balance on dashboard
2. ✅ Click "Apply Leave" and submit request
3. ✅ Admin sees request in admin panel
4. ✅ Admin approves → Employee's leave balance decreases
5. ✅ Admin marks attendance → All employees marked
6. ✅ Admin overrides individual → Saved

**That's it! Simple, working, basic.** 🎉

---

## 🔧 Next Steps (After Basic Works)

**Phase 2 Enhancements** (Add later):
1. Email notifications
2. Manager approval layer
3. Leave history page
4. Holiday management
5. Better UI/UX
6. Validation & error handling
7. Reports & analytics

---

## 🚀 Ready to Build?

This is the **absolute minimum** to get a working system.

**Shall I proceed with this basic implementation?**

Say "yes" and I'll start building:
1. Backend APIs first
2. Then frontend pages
3. Test as we go

Let's keep it simple! 🎯
