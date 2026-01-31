# Leave & Attendance System - Implementation Status

## ✅ COMPLETED

### **1. Database Schema** ✅
**File**: `server/database.py`

**Tables Created**:
- ✅ `LeaveBalance` - Stores leave totals and used for each user
- ✅ `LeaveRequest` - Tracks leave applications and approvals
- ✅ `Attendance` - Daily attendance records
- ✅ `Holiday` - All holidays (mandatory, optional, week-offs)
- ✅ `OptionalHolidayTaken` - Tracks which users took optional holidays
- ✅ `WorkingSaturday` - Special Saturdays when office is open

**Total**: 6 new tables (plus existing User and Payroll tables)

---

### **2. Pydantic Schemas** ✅
**File**: `server/schemas.py`

**Schemas Created**:
- ✅ `LeaveBalanceCreate`, `LeaveBalanceUpdate`, `LeaveBalanceResponse`
- ✅ `LeaveRequestCreate`, `LeaveRequestUpdate`, `LeaveRequestResponse`
- ✅ `AttendanceCreate`, `AttendanceUpdate`, `AttendanceResponse`
- ✅ `BulkAttendanceRow` - For CSV bulk upload
- ✅ `HolidayCreate`, `HolidayUpdate`, `HolidayResponse`
- ✅ `WorkingSaturdayCreate`, `WorkingSaturdayResponse`
- ✅ `OptionalHolidayTakenCreate`, `OptionalHolidayTakenResponse`

**Total**: 20+ new schemas with validation

---

## 🚧 IN PROGRESS

### **3. API Endpoints** 🚧
**File**: `server/routes.py` (needs to be created/updated)

**Required Endpoints**:

#### **Leave Balance** (Admin)
```python
POST   /api/admin/leave-balance           # Create leave balance
GET    /api/admin/leave-balance           # Get all leave balances
GET    /api/admin/leave-balance/{user_id} # Get specific user
PUT    /api/admin/leave-balance/{user_id} # Update leave balance
POST   /api/admin/leave-balance/reset     # Reset for new year
```

#### **Leave Requests** (User + Admin)
```python
# User endpoints
POST   /api/leave-requests                # Apply for leave
GET    /api/leave-requests                # View own requests
DELETE /api/leave-requests/{id}           # Cancel pending request

# Admin endpoints
GET    /api/admin/leave-requests          # View all requests
GET    /api/admin/leave-requests/pending  # View pending only
PUT    /api/admin/leave-requests/{id}/approve  # Approve
PUT    /api/admin/leave-requests/{id}/reject   # Reject
```

#### **Attendance** (Admin)
```python
POST   /api/admin/attendance              # Create single record
POST   /api/admin/attendance/bulk         # Bulk upload CSV
GET    /api/admin/attendance              # Get all records
GET    /api/admin/attendance/{user_id}    # Get user's attendance
PUT    /api/admin/attendance/{id}         # Update record
DELETE /api/admin/attendance/{id}         # Delete record
```

#### **Holidays** (Admin + User)
```python
# Admin endpoints
POST   /api/admin/holidays                # Create holiday
POST   /api/admin/holidays/bulk           # Bulk upload
GET    /api/admin/holidays                # Get all holidays
PUT    /api/admin/holidays/{id}           # Update holiday
DELETE /api/admin/holidays/{id}           # Delete holiday

# User endpoints
GET    /api/users/holidays                # Get holidays (current year)
GET    /api/users/holidays/upcoming       # Get upcoming holidays
```

#### **Working Saturdays** (Admin + User)
```python
# Admin endpoints
POST   /api/admin/working-saturdays       # Declare working Saturday
GET    /api/admin/working-saturdays       # Get all
DELETE /api/admin/working-saturdays/{id}  # Delete

# User endpoints
GET    /api/users/working-saturdays       # Get upcoming
```

#### **Optional Holidays** (User)
```python
GET    /api/users/optional-holidays       # Get available optional holidays
POST   /api/users/optional-holidays/apply # Apply for optional holiday
GET    /api/users/optional-holidays/taken # Get taken optional holidays
```

#### **Dashboard** (User)
```python
GET    /api/users/leave-balance           # Get own leave balance
GET    /api/users/attendance/summary      # Get attendance summary
```

**Status**: Need to implement ~30 endpoints

---

## 📋 TODO

### **4. Frontend - Admin Pages** 📋

#### **A. Leave Management Page** (`/admin/leave-management`)
**Features**:
- Table showing all users' leave balances
- Edit button to adjust totals
- Add/Deduct leave manually
- Reset balances for new year
- Filter by user

**Components Needed**:
- LeaveBalanceTable
- EditLeaveBalanceDialog
- ResetLeaveBalancesButton

---

#### **B. Leave Requests Page** (`/admin/leave-requests`)
**Features**:
- Tabs: Pending, Approved, Rejected, All
- Table with user, type, dates, days, reason
- Approve/Reject buttons
- Rejection reason dialog
- Filter by user, date, type

**Components Needed**:
- LeaveRequestsTable
- ApproveRejectButtons
- RejectionReasonDialog
- FilterBar

---

#### **C. Attendance Management Page** (`/admin/attendance`)
**Features**:
- Calendar view or table view
- Single entry form
- **Bulk upload button (CSV)**
- Edit/Delete records
- Filter by user, date, status
- Export report

**Components Needed**:
- AttendanceCalendar
- AttendanceTable
- SingleEntryForm
- BulkUploadDialog (CSV)
- ExportButton

---

#### **D. Holiday Management Page** (`/admin/holidays`)
**Features**:
- Tabs: Mandatory, Optional, Working Saturdays, All
- Add holiday button
- Bulk upload button
- Table with edit/delete
- Optional holiday usage report

**Components Needed**:
- HolidayTable
- AddHolidayDialog
- BulkUploadDialog
- WorkingSaturdaySection
- OptionalHolidayUsageReport

---

### **5. Frontend - User Pages** 📋

#### **A. Apply Leave Page** (`/leave/apply`)
**Features**:
- Leave type dropdown
- Date range picker
- Days auto-calculation
- Reason field
- Current balance display
- Validation

**Components Needed**:
- LeaveApplicationForm
- DateRangePicker
- LeaveBalanceCard
- SubmitButton

---

#### **B. Leave History Page** (`/leave/history`)
**Features**:
- Table showing all requests
- Status badges
- Cancel button for pending
- Filter by status, date

**Components Needed**:
- LeaveHistoryTable
- StatusBadge
- CancelButton
- FilterBar

---

#### **C. Attendance View Page** (`/attendance`)
**Features**:
- Calendar view
- Color-coded status
- Monthly summary
- Export option

**Components Needed**:
- AttendanceCalendar
- MonthlySummaryCard
- LegendCard
- ExportButton

---

#### **D. Holiday Calendar Page** (`/holidays`)
**Features**:
- Calendar view with holidays
- Color-coded categories
- Legend
- Filter by category
- Apply optional holiday button

**Components Needed**:
- HolidayCalendar
- LegendCard
- ApplyOptionalHolidayDialog
- FilterBar

---

### **6. Dashboard Updates** 📋

#### **A. Leave Balance Card** (Replace Static)
**Current**:
```
Annual Leave: 12 / 20 Days
Sick Leave: 8 / 10 Days
```

**New**:
```
Earned Leave:      16 / 21 Days
Casual Leave:       5 / 7 Days
Sick Leave:        11 / 14 Days
Comp Off:           2 / 2 Days
Optional Holidays:  2 / 2 remaining
```

---

#### **B. New Cards to Add**

**Holiday Card**:
```
📅 UPCOMING HOLIDAYS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇮🇳 Republic Day - Jan 26 (Mandatory)
🎉 Holi - Mar 14 (Optional - 2/2 remaining)
💼 Working Saturday - Feb 15 (Client Work)
```

**Attendance Summary Card**:
```
📈 ATTENDANCE SUMMARY (January 2026)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Working Days:    22
Present:               20 ✅
Leaves:                2 📅
Attendance %:          100%
```

**Working Saturday Alert Banner**:
```
⚠️ WORKING SATURDAY ALERT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Office is open on Saturday, Feb 15, 2026
Reason: Client Deployment
You will earn 1 Comp Off ⭐
```

---

#### **C. Quick Actions Updates**
Add buttons:
- Apply Leave
- View Attendance
- Leave History
- Holiday Calendar

---

### **7. API Client Updates** 📋
**File**: `client/utils/apiClient.js`

Need to add methods for:
- Leave balance operations
- Leave request operations
- Attendance operations
- Holiday operations
- Working Saturday operations
- Optional holiday operations

**Estimated**: 25+ new API methods

---

## 📊 Implementation Estimate

### **Backend** (API Endpoints)
- **Complexity**: Medium-High
- **Estimated Time**: This will be a large implementation
- **Files to Create/Update**:
  - `server/routes.py` - Add all new endpoints
  - `server/main.py` - Register new routers

### **Frontend** (Admin Pages)
- **Complexity**: High
- **Estimated Time**: Significant work
- **Files to Create**:
  - `client/pages/admin/leave-management.js`
  - `client/pages/admin/leave-requests.js`
  - `client/pages/admin/attendance.js`
  - `client/pages/admin/holidays.js`

### **Frontend** (User Pages)
- **Complexity**: Medium
- **Estimated Time**: Moderate
- **Files to Create**:
  - `client/pages/leave/apply.js`
  - `client/pages/leave/history.js`
  - `client/pages/attendance.js`
  - `client/pages/holidays.js`

### **Frontend** (Dashboard Updates)
- **Complexity**: Medium
- **Estimated Time**: Moderate
- **Files to Update**:
  - `client/pages/dashboard.js` - Update leave card, add new cards
  - `client/utils/apiClient.js` - Add API methods

---

## 🎯 Recommended Approach

Given the scope, I recommend implementing in phases:

### **Phase 1: Core Leave System** (Highest Priority)
1. ✅ Database & Schemas (DONE)
2. 🚧 Leave Balance API endpoints
3. 🚧 Leave Request API endpoints
4. 🚧 Dashboard leave balance card (real data)
5. 🚧 User apply leave page
6. 🚧 Admin leave management page

### **Phase 2: Attendance System**
1. Attendance API endpoints
2. Bulk upload functionality
3. Admin attendance management page
4. User attendance view page

### **Phase 3: Holiday System**
1. Holiday API endpoints
2. Working Saturday API endpoints
3. Admin holiday management page
4. User holiday calendar page
5. Optional holiday application

### **Phase 4: Dashboard Enhancements**
1. Holiday card
2. Attendance summary card
3. Working Saturday alerts
4. Quick actions updates

---

## 🚀 Next Steps

**Immediate Actions**:
1. Implement Leave Balance API endpoints
2. Implement Leave Request API endpoints
3. Update dashboard leave balance card
4. Create user apply leave page
5. Create admin leave management page

**Would you like me to**:
- A) Continue with Phase 1 implementation (Leave System)?
- B) Focus on a specific feature first?
- C) Create a minimal working version with basic features?

Let me know how you'd like to proceed! 🎯
