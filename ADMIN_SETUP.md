# Admin System Setup Guide

## Overview

The Employee Portal now has an **Admin System** where:
- ✅ Only admins can create new users
- ✅ Admins set the initial password for new users
- ✅ Public registration is disabled
- ✅ Users cannot self-register

## Quick Start

### 1. Update Existing Database (If you have existing data)

If you already have an existing database with users, run the migration script:

```bash
cd server
python migrate_db.py
```

This will add the `is_admin` column to your existing users table.

### 2. Start Fresh (Recommended for testing)

If you want to start with a clean database:

```bash
cd server
# Delete the old database
rm employee_portal.db  # On Mac/Linux
# OR
del employee_portal.db  # On Windows

# Start the server (it will create a new database with admin user)
python main.py
```

### 3. Access Admin Panel

**Default Admin Credentials:**
- **Email:** `admin@zenx.com`
- **Password:** `admin123`

**Admin URL:** `http://localhost:3000/admin`

⚠️ **IMPORTANT:** Change the default admin password immediately after first login!

## Admin Features

### User Management

Admins can:
1. **Create New Users**
   - Set name, email, and initial password
   - Choose if user should be admin or regular user
   
2. **Edit Users**
   - Update name and email
   - Reset passwords
   
3. **Delete Users**
   - Remove users from the system
   - Cannot delete own account

### User Login Flow

1. Admin creates user account with initial password
2. Admin provides credentials to the user
3. User logs in with provided credentials
4. User is redirected to their dashboard

## API Endpoints

### Admin Endpoints (Requires Admin Token)

```
POST   /api/admin/users          - Create new user
GET    /api/admin/users          - Get all users
GET    /api/admin/users/{id}     - Get specific user
PUT    /api/admin/users/{id}     - Update user
DELETE /api/admin/users/{id}     - Delete user
```

### Authentication Endpoints (Public)

```
POST   /api/auth/login           - Login (both admin and users)
GET    /api/auth/me              - Get current user info
```

### User Endpoints (Requires User Token)

```
GET    /api/users/profile        - Get user profile
```

## Security Features

✅ **Role-Based Access Control (RBAC)**
- Admin routes are protected and require admin privileges
- Regular users cannot access admin endpoints

✅ **JWT Authentication**
- All protected routes require valid JWT token
- Tokens expire after 30 minutes

✅ **Password Hashing**
- All passwords are hashed using bcrypt
- Passwords are never stored in plain text

✅ **No Public Registration**
- `/api/auth/register` endpoint has been removed
- Only admins can create users

## Database Schema

### Users Table

| Column          | Type     | Description                    |
|-----------------|----------|--------------------------------|
| id              | Integer  | Primary key                    |
| name            | String   | User's full name               |
| email           | String   | Unique email (login username)  |
| hashed_password | String   | Bcrypt hashed password         |
| is_admin        | Boolean  | Admin flag (default: false)    |
| created_at      | DateTime | Account creation timestamp     |
| updated_at      | DateTime | Last update timestamp          |

## Frontend Pages

### Admin Pages
- `/admin` - Admin dashboard with user management

### User Pages
- `/login` - Login page (both admin and users)
- `/dashboard` - User dashboard (regular users only)
- `/` - Landing page

### Removed Pages
- ~~`/register`~~ - Public registration removed

## Testing the System

### 1. Test Admin Login

```bash
# Login as admin
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zenx.com","password":"admin123"}'
```

### 2. Create a Test User (Admin Only)

```bash
# Use the token from login response
curl -X POST http://localhost:8000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "is_admin": false
  }'
```

### 3. Test User Login

```bash
# Login as the newly created user
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## Troubleshooting

### Issue: "Database doesn't have is_admin column"

**Solution:** Run the migration script:
```bash
cd server
python migrate_db.py
```

### Issue: "Admin user not found"

**Solution:** The admin user is created automatically on server startup. Restart the server:
```bash
cd server
python main.py
```

### Issue: "Cannot access admin panel"

**Possible causes:**
1. Not logged in as admin - Check credentials
2. Token expired - Login again
3. User account is not admin - Check `is_admin` flag in database

### Issue: "Public registration still works"

**Solution:** Make sure you've updated to the latest code. The `/api/auth/register` endpoint should be removed from `routes.py`.

## Best Practices

1. **Change Default Admin Password**
   - Change `admin123` to a strong password immediately
   - Update in admin panel after first login

2. **Create Strong Passwords for Users**
   - Use minimum 8 characters
   - Include uppercase, lowercase, numbers, and symbols
   - Consider using a password generator

3. **Inform Users of Their Credentials**
   - Send credentials securely (not via email)
   - Encourage users to change password on first login (feature coming soon)

4. **Regular Backups**
   - Backup `employee_portal.db` regularly
   - Store backups securely

5. **Monitor Admin Actions**
   - Keep track of who creates/modifies users
   - Review user list regularly

## Future Enhancements

Planned features:
- [ ] Force password change on first login
- [ ] Password strength requirements
- [ ] User activity logs
- [ ] Email notifications for new accounts
- [ ] Bulk user import (CSV)
- [ ] User roles and permissions
- [ ] Two-factor authentication

## Support

If you encounter any issues:
1. Check the server logs
2. Verify database schema
3. Ensure all dependencies are installed
4. Check API documentation at `http://localhost:8000/docs`

---

**Last Updated:** January 2026
**Version:** 2.0.0
