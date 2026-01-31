# Simplified Leave & Attendance System

## 🎯 Simplified Approach

### **Key Changes**:
1. ✅ Leave requests go to **Manager** (not admin)
2. ✅ Manager gets **email notification**
3. ✅ Manager approves → informs admin → admin updates attendance
4. ✅ **No complex CSV upload**
5. ✅ **Picklist-based bulk operations**

---

## 📧 Leave Request Workflow

### **Step 1: Employee Applies for Leave**
- Employee fills form: Type, Dates, Reason
- Submits request

### **Step 2: Manager Gets Email** 📧
**Email Content**:
```
Subject: Leave Request from John Doe

Hi Manager,

John Doe has requested leave:
- Type: Casual Leave
- Dates: Feb 15 - Feb 16, 2026
- Days: 2
- Reason: Personal work

Please review and approve/reject:
[Approve] [Reject]

Or login to portal: https://portal.zenx.com/manager/leave-requests
```

### **Step 3: Manager Approves/Rejects**
- Manager clicks approve/reject in email OR
- Manager logs into portal
- Adds comments if rejecting

### **Step 4: Employee Gets Notification**
- Email: "Your leave request has been approved by Manager"
- Shows in portal

### **Step 5: Manager Informs Admin**
- Manager sends email/message to admin
- Admin updates attendance system

---

## 📊 Attendance Management (Simplified)

### **Admin Dashboard - Attendance Page**

#### **Section 1: Bulk Operations** (Quick Actions)

```
┌─────────────────────────────────────────────────────────┐
│  BULK ATTENDANCE OPERATIONS                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Select Date: [📅 Feb 15, 2026]                         │
│                                                          │
│  Quick Actions:                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ 🟢 Mark All  │ │ 🔴 Mark All  │ │ 🎉 Mark All  │   │
│  │   PRESENT    │ │   ABSENT     │ │   HOLIDAY    │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                          │
│  This will mark ALL employees with selected status      │
│  You can override individual employees below            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**What happens**:
- Admin selects date
- Clicks "Mark All Present" → All employees marked as present
- Then admin can override individual cases below

---

#### **Section 2: Individual Overrides** (Employee List)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  INDIVIDUAL ATTENDANCE (Feb 15, 2026)                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Employee          | Current Status | Override Status ▼     | Hours | Save │
│  ─────────────────────────────────────────────────────────────────────────  │
│  John Doe          | Present ✅     | [Dropdown ▼]          | 9.0   | 💾   │
│  Jane Smith        | Present ✅     | [Dropdown ▼]          | 9.0   | 💾   │
│  Bob Wilson        | Present ✅     | [Dropdown ▼]          | 9.0   | 💾   │
│  Alice Brown       | Present ✅     | [Dropdown ▼]          | 9.0   | 💾   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Dropdown Options**:
```
Override Status:
├─ Present (Full Day)
├─ Half Day
├─ Absent
├─ Leave - Earned
├─ Leave - Casual
├─ Leave - Sick
├─ Leave - Comp Off
├─ Leave - LOP (Loss of Pay)
├─ Optional Holiday
├─ Mandatory Holiday
├─ Week Off
└─ Working Saturday
```

**Workflow**:
1. Admin clicks "Mark All Present" for Feb 15
2. All employees show "Present ✅"
3. Admin sees John Doe took leave (manager approved)
4. Admin clicks dropdown for John Doe
5. Selects "Leave - Casual"
6. Clicks Save 💾
7. John's status updated, leave balance auto-deducted

---

## 🗄️ Database Updates

### **Add Manager Field to User Table**
```python
class User(Base):
    # ... existing fields ...
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    manager_email = Column(String, nullable=True)  # For email notifications
```

### **LeaveRequest - Add Manager Approval**
```python
class LeaveRequest(Base):
    # ... existing fields ...
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    manager_approved_at = Column(DateTime, nullable=True)
    manager_comments = Column(String, nullable=True)
```

---

## 📧 Email Notifications

### **Required Email Functions**

```python
# server/email_service.py

def send_leave_request_to_manager(leave_request, employee, manager):
    """Send email to manager when employee applies for leave"""
    subject = f"Leave Request from {employee.name}"
    body = f"""
    Hi {manager.name},
    
    {employee.name} has requested leave:
    
    Type: {leave_request.leave_type}
    Dates: {leave_request.start_date} to {leave_request.end_date}
    Days: {leave_request.days}
    Reason: {leave_request.reason}
    
    Please review and approve/reject in the portal:
    https://portal.zenx.com/manager/leave-requests/{leave_request.id}
    
    Best regards,
    ZenX Connect
    """
    send_email(manager.email, subject, body)

def send_leave_approval_to_employee(leave_request, employee, manager):
    """Notify employee when leave is approved"""
    subject = "Leave Request Approved"
    body = f"""
    Hi {employee.name},
    
    Your leave request has been APPROVED by {manager.name}.
    
    Type: {leave_request.leave_type}
    Dates: {leave_request.start_date} to {leave_request.end_date}
    Days: {leave_request.days}
    
    Your manager will inform admin to update attendance.
    
    Best regards,
    ZenX Connect
    """
    send_email(employee.email, subject, body)

def send_leave_rejection_to_employee(leave_request, employee, manager):
    """Notify employee when leave is rejected"""
    subject = "Leave Request Rejected"
    body = f"""
    Hi {employee.name},
    
    Your leave request has been REJECTED by {manager.name}.
    
    Type: {leave_request.leave_type}
    Dates: {leave_request.start_date} to {leave_request.end_date}
    Reason: {leave_request.rejection_reason}
    
    Please contact your manager for more details.
    
    Best regards,
    ZenX Connect
    """
    send_email(employee.email, subject, body)
```

---

## 🔌 Simplified API Endpoints

### **Leave Requests** (Reduced)
```python
# User endpoints
POST   /api/leave-requests              # Employee applies
GET    /api/leave-requests              # View own requests
DELETE /api/leave-requests/{id}         # Cancel pending

# Manager endpoints
GET    /api/manager/leave-requests      # View team's requests
PUT    /api/manager/leave-requests/{id}/approve  # Approve
PUT    /api/manager/leave-requests/{id}/reject   # Reject

# Admin endpoints (view only)
GET    /api/admin/leave-requests        # View all (for reference)
```

### **Attendance** (Simplified)
```python
# Admin endpoints only
POST   /api/admin/attendance/bulk-present   # Mark all present
POST   /api/admin/attendance/bulk-absent    # Mark all absent
POST   /api/admin/attendance/bulk-holiday   # Mark all holiday
PUT    /api/admin/attendance/{user_id}      # Override individual
GET    /api/admin/attendance                # View all
```

### **Leave Balance** (Auto-calculated)
```python
# User endpoints
GET    /api/users/leave-balance         # View own balance

# Admin endpoints
GET    /api/admin/leave-balance         # View all balances
PUT    /api/admin/leave-balance/{user_id}  # Manual adjustment
```

---

## 💻 Frontend Pages (Simplified)

### **1. Employee - Apply Leave** (`/leave/apply`)
**Simple Form**:
```
┌─────────────────────────────────────────────┐
│  APPLY FOR LEAVE                             │
├─────────────────────────────────────────────┤
│                                              │
│  Leave Type: [Dropdown ▼]                   │
│  ├─ Earned Leave (16 days remaining)        │
│  ├─ Casual Leave (5 days remaining)         │
│  ├─ Sick Leave (11 days remaining)          │
│  └─ Comp Off (2 days remaining)             │
│                                              │
│  Start Date: [📅 Feb 15, 2026]              │
│  End Date:   [📅 Feb 16, 2026]              │
│                                              │
│  Days: 2 (auto-calculated)                  │
│                                              │
│  Reason: [Text area]                        │
│                                              │
│  [Submit Request]                            │
│                                              │
│  Note: Your manager will receive an email   │
│        and will approve/reject your request │
│                                              │
└─────────────────────────────────────────────┘
```

---

### **2. Manager - Leave Requests** (`/manager/leave-requests`)
**Approval Dashboard**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│  TEAM LEAVE REQUESTS                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Tabs: [Pending] [Approved] [Rejected] [All]                           │
│                                                                          │
│  Employee    | Type    | Dates        | Days | Reason      | Actions   │
│  ──────────────────────────────────────────────────────────────────────│
│  John Doe    | Casual  | Feb 15-16    | 2    | Personal    | ✅ ❌     │
│  Jane Smith  | Earned  | Mar 10-14    | 5    | Vacation    | ✅ ❌     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

When clicking ✅ Approve:
┌────────────────────────────────┐
│  Approve Leave Request?         │
├────────────────────────────────┤
│                                 │
│  Employee: John Doe             │
│  Type: Casual Leave             │
│  Dates: Feb 15-16, 2026         │
│  Days: 2                        │
│                                 │
│  Comments (optional):           │
│  [Text area]                    │
│                                 │
│  ⚠️ Remember to inform admin    │
│     to update attendance        │
│                                 │
│  [Confirm Approve] [Cancel]     │
│                                 │
└────────────────────────────────┘
```

---

### **3. Admin - Attendance Management** (`/admin/attendance`)
**Simplified Interface**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ATTENDANCE MANAGEMENT                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📅 Select Date: [Feb 15, 2026] [◀ Previous Day] [Next Day ▶]          │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  BULK OPERATIONS                                                  │  │
│  │                                                                    │  │
│  │  [🟢 Mark All Present] [🔴 Mark All Absent] [🎉 Mark All Holiday]│  │
│  │                                                                    │  │
│  │  This will apply to all employees. Override individually below.   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  INDIVIDUAL ATTENDANCE                                            │  │
│  │                                                                    │  │
│  │  Search: [🔍 Search employee...]                                  │  │
│  │                                                                    │  │
│  │  Employee        | Status      | Override ▼       | Hours | Save │  │
│  │  ────────────────────────────────────────────────────────────────│  │
│  │  John Doe        | Present ✅  | [Dropdown]       | 9.0   | 💾   │  │
│  │  Jane Smith      | Present ✅  | [Dropdown]       | 9.0   | 💾   │  │
│  │  Bob Wilson      | Present ✅  | [Leave-Casual ▼] | 0.0   | 💾   │  │
│  │  Alice Brown     | Present ✅  | [Dropdown]       | 9.0   | 💾   │  │
│  │  ...             | ...         | ...              | ...   | ...  │  │
│  │                                                                    │  │
│  │  Showing 10 of 50 employees                                       │  │
│  │  [Previous] [1] [2] [3] [4] [5] [Next]                           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

Dropdown Options:
┌────────────────────────┐
│ Present (Full Day)     │
│ Half Day               │
│ Absent                 │
│ ─────────────────────  │
│ Leave - Earned         │
│ Leave - Casual         │
│ Leave - Sick           │
│ Leave - Comp Off       │
│ Leave - LOP            │
│ ─────────────────────  │
│ Optional Holiday       │
│ Mandatory Holiday      │
│ Week Off               │
│ Working Saturday       │
└────────────────────────┘
```

---

## 🎯 Implementation Priority

### **Phase 1: Leave Request System** (Highest Priority)
1. ✅ Database updates (add manager fields)
2. ✅ Email service setup
3. ✅ Leave request API endpoints
4. ✅ Employee apply leave page
5. ✅ Manager approval page
6. ✅ Email notifications

### **Phase 2: Attendance Management** (Simplified)
1. ✅ Bulk operations API
2. ✅ Individual override API
3. ✅ Admin attendance page
4. ✅ Picklist dropdowns

### **Phase 3: Dashboard Integration**
1. ✅ Show real leave balance
2. ✅ Show leave request status
3. ✅ Quick actions

---

## 📧 Email Configuration

### **Required Settings** (`server/.env`)
```env
# Email settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@zenx.com
```

### **Install Email Package**
```bash
pip install python-multipart aiosmtplib
```

---

## ✅ Summary

This simplified approach:

1. **✅ Leave Requests → Manager** (not admin)
2. **✅ Manager gets email** (automatic notification)
3. **✅ No complex CSV upload**
4. **✅ Simple picklist-based attendance**
5. **✅ Bulk operations** (mark all present/absent/holiday)
6. **✅ Individual overrides** (for exceptions)
7. **✅ Auto-deduct leave balance** (when admin marks leave)

**Much simpler to implement and use!** 🚀

Should I proceed with this simplified implementation?
