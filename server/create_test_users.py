from database import SessionLocal, User, Payroll, LeaveBalance
from auth import get_password_hash
from datetime import datetime

def create_test_users():
    db = SessionLocal()
    try:
        # Check if test user already exists
        existing_user = db.query(User).filter(User.email == "john.doe@zenx.com").first()
        if existing_user:
            print("[X] Test users already exist!")
            return
        
        # Create test user 1
        user1 = User(
            name="John Doe",
            email="john.doe@zenx.com",
            hashed_password=get_password_hash("password123"),
            is_admin=False,
            must_change_password=False,
            role="Software Engineer",
            experience=3,
            skills="Python, FastAPI, React"
        )
        db.add(user1)
        db.flush()
        
        # Create payroll for user1
        payroll1 = Payroll(
            user_id=user1.id,
            basic_salary=50000.0,
            hra=10000.0,
            transport_allowance=2000.0,
            other_allowances=3000.0,
            tax=8000.0,
            provident_fund=5000.0,
            insurance=1000.0,
            other_deductions=500.0,
            bonus=5000.0,
            lop_days=0.0,
            absent_days=0.0,
            lop_deduction=0.0,
            month="January 2026",
            year=2026,
            status="paid"
        )
        db.add(payroll1)
        
        # Create leave balance for user1
        leave1 = LeaveBalance(
            user_id=user1.id,
            year=2026,
            earned_leave_total=21,
            earned_leave_used=0,
            casual_leave_total=7,
            casual_leave_used=0,
            sick_leave_total=14,
            sick_leave_used=0,
            comp_off_total=0,
            comp_off_used=0
        )
        db.add(leave1)
        
        # Create test user 2
        user2 = User(
            name="Jane Smith",
            email="jane.smith@zenx.com",
            hashed_password=get_password_hash("password123"),
            is_admin=False,
            must_change_password=False,
            role="Product Manager",
            experience=5,
            skills="Product Strategy, Agile, User Research"
        )
        db.add(user2)
        db.flush()
        
        # Create payroll for user2
        payroll2 = Payroll(
            user_id=user2.id,
            basic_salary=60000.0,
            hra=12000.0,
            transport_allowance=2000.0,
            other_allowances=4000.0,
            tax=10000.0,
            provident_fund=6000.0,
            insurance=1000.0,
            other_deductions=500.0,
            bonus=7000.0,
            lop_days=0.0,
            absent_days=0.0,
            lop_deduction=0.0,
            month="January 2026",
            year=2026,
            status="paid"
        )
        db.add(payroll2)
        
        # Create leave balance for user2
        leave2 = LeaveBalance(
            user_id=user2.id,
            year=2026,
            earned_leave_total=21,
            earned_leave_used=2,
            casual_leave_total=7,
            casual_leave_used=1,
            sick_leave_total=14,
            sick_leave_used=0,
            comp_off_total=0,
            comp_off_used=0
        )
        db.add(leave2)
        
        db.commit()
        print("[OK] Test users created successfully!")
        print("\nTest User 1:")
        print("  Email: john.doe@zenx.com")
        print("  Password: password123")
        print("\nTest User 2:")
        print("  Email: jane.smith@zenx.com")
        print("  Password: password123")
        print("\nAdmin User:")
        print("  Email: admin@zenx.com")
        print("  Password: admin123")
        
    except Exception as e:
        db.rollback()
        print(f"Error creating test users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_test_users()
