"""
Database migration script to add is_admin column to existing database
Run this script once to update your existing database
"""
import sqlite3
import os

# Path to your database
DB_PATH = "employee_portal.db"

def migrate_database():
    """Add is_admin column to users table if it doesn't exist"""
    
    if not os.path.exists(DB_PATH):
        print("Database doesn't exist yet. It will be created automatically when you run the server.")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if is_admin column exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'is_admin' not in columns:
            print("Adding is_admin column to users table...")
            cursor.execute("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0 NOT NULL")
            conn.commit()
            print("✓ is_admin column added successfully!")
        else:
            print("✓ is_admin column already exists!")
        
        print("\nDatabase migration completed successfully!")
        print("\nDefault admin credentials:")
        print("Email: admin@zenx.com")
        print("Password: admin123")
        print("\nThe admin user will be created automatically when you start the server.")
        
    except Exception as e:
        print(f"Error during migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Database Migration Script")
    print("=" * 60)
    migrate_database()
