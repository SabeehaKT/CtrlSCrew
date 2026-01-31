# Leave & Attendance Management System - Implementation Plan

## 📋 Research Summary: Leave Types in India

Based on Indian labor laws and common company practices, here are the standard leave types:

### **1. Earned Leave (EL) / Privilege Leave (PL)** ✅
- **Default**: 21 days per year
- **Purpose**: Vacations, personal reasons, festivals
- **Features**: 
  - Earned by working (1 day per 20 days worked)
  - Can be carried forward up to 3 years
  - Encashable on basic salary
  - Most flexible leave type

### **2. Casual Leave (CL)** ✅
- **Default**: 7 days per year
- **Purpose**: Unforeseen situations, short absences
- **Features**:
  - Maximum 3 days per month
  - Generally not encashable
  - Rarely carried forward
  - Some companies convert unused to EL at year-end

### **3. Sick Leave (SL)** ✅
- **Default**: 14 days per year
- **Purpose**: Health-related absences
- **Features**:
  - May require medical certificate for 3+ consecutive days
  - Usually not encashable
  - Some companies allow partial carryforward

### **4. Compensatory Off (Comp Off)** ✅
- **Default**: 0 days (earned when working on holidays)
- **Purpose**: Compensation for working on holidays/weekends
- **Features**:
  - Granted when employees work on declared holidays
  - Must be used within specific timeframe (usually 90 days)
  - Not encashable

### **5. Leave Without Pay (LWP)** ✅
- **Purpose**: When no other leaves are available
- **Features**:
  - Unpaid leave
  - Requires approval
  - Affects salary calculation

---

## 🗄️ Database Schema Implemented

### **1. LeaveBalance Table**
```sql
- id (Primary Key)
- user_id (Foreign Key to users)
- earned_leave_total (default: 21.0)
- earned_leave_used (default: 0.0)
- casual_leave_total (default: 7.0)
- casual_leave_used (default: 0.0)
- sick_leave_total (default: 14.0)
- sick_leave_used (default: 0.0)
- comp_off_total (default: 0.0)
- comp_off_used (default: 0.0)
- year (e.g., 2026)
- created_at, updated_at
```

**Calculated Fields**:
- `earned_leave_remaining = earned_leave_total - earned_leave_used`
- `casual_leave_remaining = casual_leave_total - casual_leave_used`
- `sick_leave_remaining = sick_leave_total - sick_leave_used`
- `comp_off_remaining = comp_off_total - comp_off_used`

### **2. LeaveRequest Table**
```sql
- id (Primary Key)
- user_id (Foreign Key)
- leave_type (earned, casual, sick, comp_off, unpaid)
- start_date
- end_date
- days (can be 0.5 for half day)
- reason
- status (pending, approved, rejected)
- approved_by (Foreign Key to users - admin)
- approved_at
- rejection_reason
- created_at, updated_at
```

### **3. Attendance Table**
```sql
- id (Primary Key)
- user_id (Foreign Key)
- date
- status (present, absent, half_day, leave, holiday, week_off)
- check_in (HH:MM format)
- check_out (HH:MM format)
- hours_worked
- leave_type (if status is leave)
- remarks
- created_by (Foreign Key - admin who uploaded)
- created_at, updated_at
```

---

## 🎯 Features to Implement

### **Phase 1: Leave Balance Management** (Admin)
1. ✅ Create/Update leave balance for users
2. ✅ Set custom leave totals per user
3. ✅ View all users' leave balances
4. ✅ Reset leave balances yearly
5. ✅ Adjust leave balances manually (add/deduct)

### **Phase 2: Leave Request System** (User + Admin)
**User Features**:
1. ✅ Apply for leave (select type, dates, reason)
2. ✅ View leave request history
3. ✅ Cancel pending requests
4. ✅ View leave balance in real-time

**Admin Features**:
1. ✅ View all pending leave requests
2. ✅ Approve/Reject leave requests
3. ✅ View leave request history for all users
4. ✅ Add rejection reason

### **Phase 3: Attendance Management** (Admin)
1. ✅ Manual attendance entry (single day, single user)
2. ✅ **Bulk attendance upload** (CSV/Excel)
3. ✅ View attendance reports
4. ✅ Edit attendance records
5. ✅ Mark holidays and week-offs
6. ✅ Calculate hours worked

### **Phase 4: Dashboard Integration** (User)
1. ✅ Show real leave balance (not static)
2. ✅ Show leave request status
3. ✅ Quick apply leave button
4. ✅ Attendance summary (present days, absent days)

---

## 📊 Bulk Attendance Upload Feature

### **CSV Format**:
```csv
email,date,status,check_in,check_out,hours_worked,remarks
john@company.com,2026-01-15,present,09:00,18:00,9.0,
jane@company.com,2026-01-15,present,09:30,18:30,9.0,
bob@company.com,2026-01-15,leave,,,0.0,Sick Leave
alice@company.com,2026-01-15,half_day,09:00,13:00,4.0,
```

### **Status Values**:
- `present` - Full day present
- `absent` - Absent without leave
- `half_day` - Half day (4 hours)
- `leave` - On approved leave
- `holiday` - Public holiday
- `week_off` - Weekly off (Saturday/Sunday)

### **Upload Process**:
1. Admin uploads CSV file
2. System validates:
   - User exists (by email)
   - Date format is correct
   - Status is valid
   - Hours are reasonable
3. System creates attendance records
4. System auto-updates leave balance if status is "leave"
5. Returns success/error report

---

## 🔌 API Endpoints to Create

### **Leave Balance Endpoints** (Admin)
```
POST   /api/admin/leave-balance           - Create leave balance for user
GET    /api/admin/leave-balance           - Get all users' leave balances
GET    /api/admin/leave-balance/{user_id} - Get specific user's leave balance
PUT    /api/admin/leave-balance/{user_id} - Update leave balance
POST   /api/admin/leave-balance/reset     - Reset all leave balances for new year
```

### **Leave Request Endpoints** (User + Admin)
```
POST   /api/leave-requests                - User applies for leave
GET    /api/leave-requests                - User views own leave requests
GET    /api/leave-requests/{id}           - Get specific leave request
DELETE /api/leave-requests/{id}           - User cancels pending request

GET    /api/admin/leave-requests          - Admin views all leave requests
GET    /api/admin/leave-requests/pending  - Admin views pending requests
PUT    /api/admin/leave-requests/{id}/approve - Admin approves request
PUT    /api/admin/leave-requests/{id}/reject  - Admin rejects request
```

### **Attendance Endpoints** (Admin)
```
POST   /api/admin/attendance              - Create single attendance record
POST   /api/admin/attendance/bulk         - Bulk upload attendance (CSV)
GET    /api/admin/attendance              - Get all attendance records
GET    /api/admin/attendance/{user_id}    - Get user's attendance
PUT    /api/admin/attendance/{id}         - Update attendance record
DELETE /api/admin/attendance/{id}         - Delete attendance record
```

### **User Dashboard Endpoints**
```
GET    /api/users/leave-balance           - Get own leave balance
GET    /api/users/attendance              - Get own attendance records
GET    /api/users/attendance/summary      - Get attendance summary (month/year)
```

---

## 💻 Frontend Pages to Create

### **1. Admin Leave Management Page** (`/admin/leave-management`)
**Features**:
- Table showing all users' leave balances
- Edit button to adjust leave totals
- Add/Deduct leave manually
- Reset leave balances for new year
- Filter by user, leave type

### **2. Admin Leave Requests Page** (`/admin/leave-requests`)
**Features**:
- Tabs: Pending, Approved, Rejected, All
- Table showing leave requests with user name, type, dates, days, reason
- Approve/Reject buttons
- Add rejection reason dialog
- Filter by user, date range, leave type

### **3. Admin Attendance Management Page** (`/admin/attendance`)
**Features**:
- Calendar view or table view
- Single entry form (user, date, status, times)
- **Bulk upload button** (CSV upload)
- Edit/Delete attendance records
- Filter by user, date range, status
- Export attendance report

### **4. User Leave Application Page** (`/leave/apply`)
**Features**:
- Leave type dropdown
- Date range picker
- Days calculation (auto)
- Reason text field
- Current balance display
- Submit button
- Validation (can't apply if balance insufficient)

### **5. User Leave History Page** (`/leave/history`)
**Features**:
- Table showing all leave requests
- Status badges (Pending, Approved, Rejected)
- Cancel button for pending requests
- Filter by status, date range

### **6. User Attendance View Page** (`/attendance`)
**Features**:
- Calendar view showing attendance
- Color-coded: Green (present), Red (absent), Yellow (half-day), Blue (leave)
- Monthly summary: Total present, absent, leaves, hours worked
- Export option

---

## 📱 Dashboard Updates

### **Leave Balance Card** (Replace Static Data)
```javascript
// Current (Static):
Annual Leave: 12 / 20 Days
Sick Leave: 8 / 10 Days

// New (Dynamic from API):
Earned Leave: {earned_leave_remaining} / {earned_leave_total} Days
Casual Leave: {casual_leave_remaining} / {casual_leave_total} Days
Sick Leave: {sick_leave_remaining} / {sick_leave_total} Days
Comp Off: {comp_off_remaining} / {comp_off_total} Days
```

### **Quick Actions**
- Add "Apply Leave" button
- Add "View Attendance" button
- Add "Leave History" button

---

## 🔄 Leave Balance Auto-Calculation

### **When Leave is Approved**:
```python
if leave_request.status == "approved":
    leave_balance = get_leave_balance(user_id)
    
    if leave_request.leave_type == "earned":
        leave_balance.earned_leave_used += leave_request.days
    elif leave_request.leave_type == "casual":
        leave_balance.casual_leave_used += leave_request.days
    elif leave_request.leave_type == "sick":
        leave_balance.sick_leave_used += leave_request.days
    elif leave_request.leave_type == "comp_off":
        leave_balance.comp_off_used += leave_request.days
    
    db.commit()
```

### **When Attendance is Marked as Leave**:
```python
if attendance.status == "leave":
    # Automatically create leave request or deduct from balance
    leave_balance = get_leave_balance(attendance.user_id)
    
    # Deduct based on leave_type
    if attendance.leave_type == "earned":
        leave_balance.earned_leave_used += 1.0  # or 0.5 for half day
    # ... similar for other types
    
    db.commit()
```

---

## 📋 Implementation Priority

### **High Priority** (Must Have):
1. ✅ Leave Balance Management (Admin)
2. ✅ Leave Balance Display (User Dashboard)
3. ✅ Leave Request System (User + Admin)
4. ✅ Bulk Attendance Upload (Admin)

### **Medium Priority** (Should Have):
5. ✅ Manual Attendance Entry (Admin)
6. ✅ Attendance View (User)
7. ✅ Leave Request Approval Workflow

### **Low Priority** (Nice to Have):
8. ✅ Attendance Reports & Analytics
9. ✅ Leave Encashment Calculation
10. ✅ Email Notifications for Leave Approval/Rejection

---

## 🚀 Next Steps

1. **Stop Server** - To delete old database
2. **Delete Database** - `del employee_portal.db`
3. **Restart Server** - Database will be created with new tables
4. **Implement API Endpoints** - Leave & Attendance APIs
5. **Create Frontend Pages** - Admin & User pages
6. **Test Bulk Upload** - CSV attendance upload
7. **Update Dashboard** - Show real leave data

---

## 📊 Sample Leave Balance Data

```json
{
  "user_id": 2,
  "earned_leave_total": 21.0,
  "earned_leave_used": 5.0,
  "earned_leave_remaining": 16.0,
  "casual_leave_total": 7.0,
  "casual_leave_used": 2.0,
  "casual_leave_remaining": 5.0,
  "sick_leave_total": 14.0,
  "sick_leave_used": 3.0,
  "sick_leave_remaining": 11.0,
  "comp_off_total": 2.0,
  "comp_off_used": 0.0,
  "comp_off_remaining": 2.0,
  "year": 2026
}
```

---

## 📄 Sample CSV for Bulk Upload

```csv
email,date,status,check_in,check_out,hours_worked,leave_type,remarks
john@company.com,2026-01-20,present,09:00,18:00,9.0,,
john@company.com,2026-01-21,present,09:15,18:15,9.0,,
john@company.com,2026-01-22,leave,,,0.0,earned,Vacation
john@company.com,2026-01-23,half_day,09:00,13:00,4.0,,Doctor appointment
john@company.com,2026-01-24,present,09:00,18:30,9.5,,
john@company.com,2026-01-25,week_off,,,0.0,,Saturday
john@company.com,2026-01-26,week_off,,,0.0,,Sunday
```

---

## ✅ Summary

This comprehensive leave and attendance system includes:

1. **4 Leave Types** (as per Indian standards):
   - Earned Leave (21 days)
   - Casual Leave (7 days)
   - Sick Leave (14 days)
   - Comp Off (earned dynamically)

2. **Admin Control**:
   - Set leave balances
   - Approve/reject leave requests
   - Upload bulk attendance
   - View reports

3. **User Features**:
   - Apply for leave
   - View leave balance (real-time)
   - View attendance
   - Track leave requests

4. **Automation**:
   - Auto-calculate remaining leaves
   - Auto-update balance on approval
   - Bulk attendance processing
   - Hours calculation

**Ready to implement! Let me know when you want to proceed with the API endpoints and frontend pages.** 🚀
