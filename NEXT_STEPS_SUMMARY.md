# Leave & Attendance System - Implementation Summary & Next Steps

## ✅ COMPLETED

### **1. Database Schema** ✅
**File**: `server/database.py`

**Updates Made**:
- ✅ Added `manager_id`, `manager_email`, `is_manager` to User table
- ✅ Added `manager_id`, `manager_approved_at`, `manager_comments` to LeaveRequest table
- ✅ Created 6 new tables: LeaveBalance, LeaveRequest, Attendance, Holiday, OptionalHolidayTaken, WorkingSaturday

### **2. Pydantic Schemas** ✅
**File**: `server/schemas.py`

- ✅ 20+ schemas for validation
- ✅ Leave, Attendance, Holiday schemas complete

---

## 🚀 READY TO IMPLEMENT

### **Phase 1: Leave Request System** (Priority 1)

This is a **LARGE** implementation that requires significant work. Here's what needs to be built:

#### **A. Email Service** 📧
**File to Create**: `server/email_service.py`

**Functions Needed**:
```python
- send_leave_request_to_manager()      # When employee applies
- send_leave_approval_to_employee()    # When manager approves
- send_leave_rejection_to_employee()   # When manager rejects
```

**Dependencies**:
```bash
pip install aiosmtplib email-validator
```

**Environment Variables** (`.env`):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@zenx.com
```

---

#### **B. Leave Request API Endpoints**
**File to Update**: `server/routes.py`

**Endpoints to Create** (~10 endpoints):

**User Endpoints**:
```python
POST   /api/leave-requests              # Apply for leave
GET    /api/leave-requests              # View own requests  
GET    /api/leave-requests/{id}         # View specific request
DELETE /api/leave-requests/{id}         # Cancel pending request
GET    /api/users/leave-balance         # Get own leave balance
```

**Manager Endpoints**:
```python
GET    /api/manager/leave-requests      # View team's requests
GET    /api/manager/leave-requests/pending  # View pending only
PUT    /api/manager/leave-requests/{id}/approve  # Approve request
PUT    /api/manager/leave-requests/{id}/reject   # Reject request
```

**Admin Endpoints**:
```python
GET    /api/admin/leave-requests        # View all requests (reference)
GET    /api/admin/leave-balance         # View all balances
PUT    /api/admin/leave-balance/{user_id}  # Manual adjustment
POST   /api/admin/leave-balance         # Create leave balance
```

---

#### **C. Frontend - Employee Apply Leave Page**
**File to Create**: `client/pages/leave/apply.js`

**Features**:
- Leave type dropdown (Earned/Casual/Sick/Comp Off/LOP)
- Date range picker
- Auto-calculate days
- Show current balance
- Reason text field
- Validation (can't apply if insufficient balance)
- Submit button

**Estimated**: ~300-400 lines of code

---

#### **D. Frontend - Manager Leave Approval Page**
**File to Create**: `client/pages/manager/leave-requests.js`

**Features**:
- Tabs: Pending, Approved, Rejected, All
- Table showing team's leave requests
- Approve/Reject buttons
- Comments dialog
- Filter by employee, date, type
- Email notification reminder

**Estimated**: ~400-500 lines of code

---

#### **E. Frontend - Leave History Page**
**File to Create**: `client/pages/leave/history.js`

**Features**:
- Table showing all user's requests
- Status badges (Pending/Approved/Rejected)
- Cancel button for pending requests
- Filter by status, date

**Estimated**: ~250-300 lines of code

---

### **Phase 2: Attendance Management** (Priority 2)

#### **A. Attendance API Endpoints**
**File to Update**: `server/routes.py`

**Endpoints to Create** (~8 endpoints):

```python
# Admin bulk operations
POST   /api/admin/attendance/bulk-present   # Mark all present for date
POST   /api/admin/attendance/bulk-absent    # Mark all absent for date
POST   /api/admin/attendance/bulk-holiday   # Mark all holiday for date

# Admin individual operations
POST   /api/admin/attendance                # Create single record
PUT    /api/admin/attendance/{user_id}/{date}  # Update individual
GET    /api/admin/attendance                # Get all for date
GET    /api/admin/attendance/{user_id}      # Get user's attendance
DELETE /api/admin/attendance/{id}           # Delete record
```

---

#### **B. Frontend - Admin Attendance Management Page**
**File to Create**: `client/pages/admin/attendance.js`

**Features**:
- Date picker
- Bulk operation buttons (Mark All Present/Absent/Holiday)
- Employee table with status dropdowns
- Individual override functionality
- Save button per employee
- Search/filter employees
- Pagination

**Estimated**: ~500-600 lines of code

---

#### **C. Frontend - User Attendance View Page**
**File to Create**: `client/pages/attendance.js`

**Features**:
- Calendar view of attendance
- Color-coded status
- Monthly summary card
- Legend
- Export option

**Estimated**: ~350-400 lines of code

---

### **Phase 3: Dashboard Updates** (Priority 3)

#### **A. Update Leave Balance Card**
**File to Update**: `client/pages/dashboard.js`

**Changes**:
- Replace static data with API call
- Show all leave types dynamically
- Show remaining days
- Add "Apply Leave" quick action

**Estimated**: ~100-150 lines of code changes

---

#### **B. Add API Client Methods**
**File to Update**: `client/utils/apiClient.js`

**Methods to Add** (~20 methods):
```javascript
// Leave requests
applyLeave()
getMyLeaveRequests()
cancelLeaveRequest()
getMyLeaveBalance()

// Manager
getTeamLeaveRequests()
approveLeaveRequest()
rejectLeaveRequest()

// Admin - Leave
getAllLeaveBalances()
updateLeaveBalance()
createLeaveBalance()

// Admin - Attendance
bulkMarkPresent()
bulkMarkAbsent()
bulkMarkHoliday()
updateIndividualAttendance()
getAttendanceForDate()
```

**Estimated**: ~200-250 lines of code

---

## 📊 Total Implementation Estimate

### **Code to Write**:
- **Backend**: ~15-20 API endpoints (~800-1000 lines)
- **Frontend**: 6 new pages (~2000-2500 lines)
- **Updates**: Dashboard + API client (~300-400 lines)
- **Email Service**: ~200-300 lines

**Total**: ~3300-4200 lines of code

### **Time Estimate**:
This is a **significant implementation** that would typically take:
- **Backend**: Several hours
- **Frontend**: Several hours
- **Testing**: Additional time
- **Integration**: Additional time

---

## 🎯 Recommended Approach

Given the scope, I recommend we proceed in **small, testable increments**:

### **Increment 1: Basic Leave Request** (Minimal Working Version)
1. ✅ Database (DONE)
2. Create email service (basic)
3. Create 3 core API endpoints:
   - POST /api/leave-requests (apply)
   - GET /api/leave-requests (view own)
   - GET /api/users/leave-balance (view balance)
4. Create basic apply leave page
5. Update dashboard to show real leave balance

**Result**: Employees can apply for leave and see their balance

---

### **Increment 2: Manager Approval**
1. Create manager API endpoints
2. Create manager approval page
3. Add email notifications

**Result**: Managers can approve/reject leaves

---

### **Increment 3: Attendance Management**
1. Create attendance API endpoints
2. Create admin attendance page
3. Add bulk operations

**Result**: Admin can manage attendance

---

### **Increment 4: Polish & Enhancements**
1. Add user attendance view
2. Add leave history page
3. Add dashboard cards
4. Add filters and search

**Result**: Complete system with all features

---

## 💡 Decision Point

**Given the large scope, would you like me to**:

**Option A**: Build Increment 1 completely (Basic Leave Request)
- This gives you a working leave system quickly
- Employees can apply, see balance
- Foundation for rest of system

**Option B**: Create all API endpoints first (Backend complete)
- Then build frontend pages one by one
- Backend will be ready for all features

**Option C**: Build one complete flow end-to-end
- Pick one feature (e.g., Apply Leave)
- Build backend + frontend + email for just that
- Then move to next feature

**Which approach would you prefer?** 🤔

---

## 📝 Important Notes

1. **Database Reset Required**: Since we added new fields, you'll need to:
   ```bash
   # Stop server (Ctrl+C)
   cd server
   del employee_portal.db
   uvicorn main:app --reload
   ```

2. **Email Configuration**: You'll need to set up SMTP credentials in `.env`

3. **Testing**: Each increment should be tested before moving to next

4. **User Roles**: Need to assign managers to employees in database

---

## 🚀 Ready to Proceed?

Let me know which approach you'd like (A, B, or C) and I'll start implementing!

**My Recommendation**: Start with **Option A** (Increment 1) to get a working system quickly, then iterate. 🎯
