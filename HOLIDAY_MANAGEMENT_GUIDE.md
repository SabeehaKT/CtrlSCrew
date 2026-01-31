# Holiday Management System - Complete Guide

## 📅 Holiday Categories

### **1. Mandatory Holidays (National/Public Holidays)** 🇮🇳
**Category**: `mandatory`

These are compulsory holidays for all employees as per Indian law:
- Republic Day (Jan 26)
- Independence Day (Aug 15)
- Gandhi Jayanti (Oct 2)
- Diwali
- Holi
- Eid
- Christmas
- etc.

**Features**:
- ✅ Office closed for everyone
- ✅ Paid holiday
- ✅ Automatically marked in attendance
- ✅ Shows in user dashboard calendar
- ✅ Cannot be worked on (unless emergency)

---

### **2. Optional Holidays (Restricted Holidays)** 🎉
**Category**: `optional`

Employees can choose from a list (typically 2-3 per year):
- Regional festivals (Pongal, Onam, Baisakhi, etc.)
- Religious holidays
- State-specific festivals

**Features**:
- ✅ Employee chooses which ones to take
- ✅ Limited quota (e.g., 2 optional holidays/year)
- ✅ Must apply in advance
- ✅ Admin tracks who took which optional holiday
- ✅ Shows as available in user dashboard
- ✅ Once taken, deducted from quota

---

### **3. Week Offs (Saturday/Sunday)** 📆
**Category**: `week_off`

Regular weekly offs:
- Saturday (usually)
- Sunday (usually)

**Features**:
- ✅ Recurring weekly
- ✅ Automatically marked in attendance
- ✅ Shows in calendar
- ✅ Can be overridden if working Saturday

---

### **4. Working Saturdays (Client Work)** 💼
**Category**: `client_work`

Special Saturdays when office is open:
- Client requirements
- Project deadlines
- Critical deliveries
- Release days

**Features**:
- ✅ Admin declares specific Saturdays as working days
- ✅ Employees must attend
- ✅ Eligible for Compensatory Off (Comp Off)
- ✅ Attendance marked as "present" on that Saturday
- ✅ Comp off auto-credited to leave balance
- ✅ Shows alert in user dashboard
- ✅ Can mark attendance with check-in/out

---

## 🗄️ Database Schema

### **1. Holiday Table**
```sql
CREATE TABLE holidays (
    id INTEGER PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    name VARCHAR NOT NULL,              -- "Republic Day", "Diwali"
    category VARCHAR NOT NULL,          -- mandatory, optional, week_off
    description TEXT,
    is_optional BOOLEAN DEFAULT FALSE,
    year INTEGER NOT NULL,
    created_at TIMESTAMP,
    created_by INTEGER                  -- Admin who created
);
```

**Sample Data**:
```json
[
  {
    "date": "2026-01-26",
    "name": "Republic Day",
    "category": "mandatory",
    "is_optional": false,
    "year": 2026
  },
  {
    "date": "2026-03-14",
    "name": "Holi",
    "category": "optional",
    "is_optional": true,
    "year": 2026
  }
]
```

---

### **2. OptionalHolidayTaken Table**
```sql
CREATE TABLE optional_holidays_taken (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    holiday_id INTEGER NOT NULL,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (holiday_id) REFERENCES holidays(id)
);
```

**Purpose**: Track which employees took which optional holidays

**Sample Data**:
```json
{
  "user_id": 5,
  "holiday_id": 12,  // Holi
  "created_at": "2026-03-10"
}
```

---

### **3. WorkingSaturday Table**
```sql
CREATE TABLE working_saturdays (
    id INTEGER PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    reason VARCHAR NOT NULL,            -- "Client requirement"
    description TEXT,
    comp_off_eligible BOOLEAN DEFAULT TRUE,
    year INTEGER NOT NULL,
    created_at TIMESTAMP,
    created_by INTEGER                  -- Admin who declared
);
```

**Sample Data**:
```json
{
  "date": "2026-02-15",
  "reason": "Client Deployment",
  "description": "Major release for ABC Corp",
  "comp_off_eligible": true,
  "year": 2026
}
```

---

## 🎯 Features & Workflows

### **Admin Features**

#### **1. Declare Holidays**
- Add mandatory holidays (national/public)
- Add optional holidays (restricted list)
- Set week-offs (Saturday/Sunday pattern)
- Bulk upload holidays via CSV

#### **2. Declare Working Saturdays**
- Mark specific Saturdays as working days
- Add reason (client requirement, deadline, etc.)
- Enable/disable comp off eligibility
- Notify all employees

#### **3. Holiday Management**
- View all holidays by year
- Edit/Delete holidays
- View optional holiday usage
- Export holiday calendar

#### **4. Bulk Attendance Upload (Enhanced)**
Now handles:
- Regular working days (present/absent/half-day)
- Leaves (with leave type)
- Holidays (mandatory/optional)
- Week-offs (Saturday/Sunday)
- Working Saturdays (with comp off)

**CSV Format**:
```csv
email,date,status,check_in,check_out,hours_worked,leave_type,holiday_category,remarks
john@company.com,2026-01-26,holiday,,,0.0,,mandatory,Republic Day
john@company.com,2026-02-15,present,09:00,18:00,9.0,,,Working Saturday - Client Work
john@company.com,2026-03-14,holiday,,,0.0,,optional,Holi (Optional Holiday Taken)
```

---

### **User Features**

#### **1. View Holiday Calendar**
- See all mandatory holidays
- See available optional holidays
- See working Saturdays
- Color-coded calendar view

#### **2. Apply for Optional Holiday**
- Choose from available optional holidays
- Check remaining quota (e.g., 2/2 remaining)
- Submit request
- Admin approves/rejects

#### **3. Dashboard Alerts**
- "Upcoming Holiday: Republic Day on Jan 26"
- "Working Saturday: Feb 15 - Client Requirement"
- "Optional Holidays: 2 remaining"

#### **4. Attendance Report**
Shows:
- Total working days
- Present days
- Absent days
- Leaves taken
- Holidays (mandatory + optional taken)
- Working Saturdays attended
- Comp offs earned

---

## 📊 Attendance Status Values (Updated)

### **Status Types**:
1. **`present`** - Employee present (regular day or working Saturday)
2. **`absent`** - Employee absent without leave
3. **`half_day`** - Half day attendance (4 hours)
4. **`leave`** - On approved leave (earned/casual/sick/comp_off)
5. **`holiday_mandatory`** - Mandatory national holiday
6. **`holiday_optional`** - Optional holiday taken by employee
7. **`week_off`** - Regular Saturday/Sunday off
8. **`working_saturday`** - Present on working Saturday (eligible for comp off)

---

## 🔄 Automatic Comp Off Calculation

### **When Employee Works on Saturday**:
```python
if attendance.date.weekday() == 5:  # Saturday
    working_saturday = get_working_saturday(attendance.date)
    
    if working_saturday and working_saturday.comp_off_eligible:
        if attendance.status == "present":
            # Credit 1 comp off
            leave_balance = get_leave_balance(user_id)
            leave_balance.comp_off_total += 1.0
            db.commit()
            
            # Notify user: "You earned 1 Comp Off for working on Feb 15"
```

---

## 📱 Dashboard Integration

### **Holiday Card** (New)
```
📅 UPCOMING HOLIDAYS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇮🇳 Republic Day - Jan 26 (Mandatory)
🎉 Holi - Mar 14 (Optional - 2/2 remaining)
💼 Working Saturday - Feb 15 (Client Work)
```

### **Leave Balance Card** (Updated)
```
📊 LEAVE BALANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Earned Leave:    16 / 21 Days
Casual Leave:     5 / 7 Days
Sick Leave:      11 / 14 Days
Comp Off:         2 / 2 Days ⭐ (Earned from working Saturdays)
Optional Holidays: 2 / 2 remaining
```

### **Attendance Summary Card** (New)
```
📈 ATTENDANCE SUMMARY (January 2026)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Working Days:    22
Present:               20 ✅
Absent:                0 ❌
Leaves:                2 📅
Holidays:              2 🎉
Working Saturdays:     1 💼
Attendance %:          100%
```

---

## 🔌 API Endpoints (Holiday Management)

### **Admin Endpoints**
```
POST   /api/admin/holidays                    - Create holiday
POST   /api/admin/holidays/bulk               - Bulk upload holidays (CSV)
GET    /api/admin/holidays                    - Get all holidays
GET    /api/admin/holidays/{year}             - Get holidays by year
PUT    /api/admin/holidays/{id}               - Update holiday
DELETE /api/admin/holidays/{id}               - Delete holiday

POST   /api/admin/working-saturdays           - Declare working Saturday
GET    /api/admin/working-saturdays           - Get all working Saturdays
GET    /api/admin/working-saturdays/{year}    - Get by year
DELETE /api/admin/working-saturdays/{id}      - Delete working Saturday

GET    /api/admin/optional-holidays/usage     - See who took which optional holidays
```

### **User Endpoints**
```
GET    /api/users/holidays                    - Get all holidays (current year)
GET    /api/users/holidays/upcoming           - Get upcoming holidays
GET    /api/users/optional-holidays           - Get available optional holidays
POST   /api/users/optional-holidays/apply     - Apply for optional holiday
GET    /api/users/working-saturdays           - Get upcoming working Saturdays
GET    /api/users/attendance/summary          - Get attendance summary with holidays
```

---

## 📄 Sample Holiday CSV for Bulk Upload

```csv
date,name,category,is_optional,description
2026-01-26,Republic Day,mandatory,false,National Holiday
2026-03-14,Holi,optional,true,Festival of Colors
2026-03-25,Gudi Padwa,optional,true,Marathi New Year
2026-04-14,Dr. Ambedkar Jayanti,optional,true,
2026-05-01,Maharashtra Day,mandatory,false,State Holiday
2026-08-15,Independence Day,mandatory,false,National Holiday
2026-08-19,Raksha Bandhan,optional,true,
2026-10-02,Gandhi Jayanti,mandatory,false,National Holiday
2026-10-24,Diwali,mandatory,false,Festival of Lights
2026-12-25,Christmas,mandatory,false,
```

---

## 📄 Sample Working Saturday CSV

```csv
date,reason,description,comp_off_eligible
2026-02-15,Client Deployment,Major release for ABC Corp,true
2026-03-22,Project Deadline,Q1 deliverables,true
2026-06-27,Year-end Closing,Financial year-end activities,true
```

---

## 📊 Attendance Report (Enhanced)

### **Monthly Report**:
```
Employee: John Doe
Month: January 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Days in Month:        31
Week Offs:                   8 (Saturdays + Sundays)
Mandatory Holidays:          2 (Republic Day, etc.)
Optional Holidays Taken:     1 (Holi)
Working Saturdays:           1 (Feb 15)

Working Days:               21 (31 - 8 - 2 + 1)
Present:                    20
Absent:                      0
Leaves:                      1 (Casual Leave)
Half Days:                   0

Attendance %:              100% (20/20)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMP OFF EARNED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Feb 15 - Client Deployment:  +1 Comp Off ⭐

Total Comp Off Balance:      3 days
```

---

## 🎨 UI Components

### **1. Holiday Calendar Page** (`/holidays`)
**Features**:
- Calendar view with color-coded holidays
- Legend:
  - 🇮🇳 Red = Mandatory holidays
  - 🎉 Orange = Optional holidays (available)
  - 💼 Blue = Working Saturdays
  - 📅 Gray = Week-offs
- Filter by category
- Export calendar

### **2. Apply Optional Holiday Dialog**
**Features**:
- List of available optional holidays
- Remaining quota display
- Date picker
- Reason field
- Submit button

### **3. Admin Holiday Management Page** (`/admin/holidays`)
**Features**:
- Tabs: Mandatory, Optional, Working Saturdays, All
- Add holiday button
- Bulk upload button
- Table with edit/delete actions
- Optional holiday usage report

### **4. Working Saturday Alert Banner**
**Shows on dashboard**:
```
⚠️ WORKING SATURDAY ALERT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Office is open on Saturday, Feb 15, 2026
Reason: Client Deployment
You will earn 1 Comp Off for attending ⭐
[View Details]
```

---

## ✅ Implementation Checklist

### **Database** ✅
- [x] Holiday table
- [x] OptionalHolidayTaken table
- [x] WorkingSaturday table
- [x] Updated Attendance status values

### **Backend** (To Do)
- [ ] Holiday API endpoints
- [ ] Working Saturday API endpoints
- [ ] Optional holiday application logic
- [ ] Comp off auto-calculation
- [ ] Enhanced bulk attendance upload

### **Frontend** (To Do)
- [ ] Holiday calendar page
- [ ] Apply optional holiday dialog
- [ ] Admin holiday management page
- [ ] Working Saturday alerts
- [ ] Enhanced attendance report
- [ ] Dashboard holiday card

---

## 🚀 Summary

This comprehensive holiday system includes:

1. **4 Holiday Categories**:
   - Mandatory (National/Public)
   - Optional (Restricted - employee choice)
   - Week-offs (Saturday/Sunday)
   - Working Saturdays (Client work)

2. **Smart Features**:
   - Auto comp off for working Saturdays
   - Optional holiday quota tracking
   - Bulk holiday upload
   - Calendar integration
   - Dashboard alerts

3. **Complete Tracking**:
   - Who took which optional holiday
   - Working Saturday attendance
   - Comp off earned
   - Holiday calendar
   - Attendance reports with holidays

**Ready to implement! The database is updated with 3 new tables for complete holiday management.** 🎉
