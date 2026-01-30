"""
Script to create an admin user in the database.
Run this once to create the initial admin account.
"""
from database import SessionLocal, User, init_db
from auth import get_password_hash

def create_admin_user():
    """Create default admin user"""
    # Initialize database
    init_db()
    
    # Create session
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.email == "admin@zenx.com").first()
        if admin:
            print("[X] Admin user already exists!")
            print(f"   Email: admin@zenx.com")
            return
        
        # Create admin user
        admin_user = User(
            name="Admin User",
            email="admin@zenx.com",
            hashed_password=get_password_hash("admin123"),
            is_admin=True,
            must_change_password=False,
            role="Administrator",
            experience=10,
            skills="Management, Leadership, HR"
        )
        
        db.add(admin_user)
        db.commit()
        
        print("[SUCCESS] Admin user created successfully!")
        print(f"   Email: admin@zenx.com")
        print(f"   Password: admin123")
        print("\n[WARNING] Please change the password after first login!")
        
    except Exception as e:
        print(f"[ERROR] Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
