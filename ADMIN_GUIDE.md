# Admin User Guide - ZenX Connect

## Default Admin Credentials

**Email:** admin@zenx.com  
**Password:** admin123

⚠️ **Important:** Change the password after first login for security!

---

## What is Admin Access?

The admin account has special privileges to manage all users in the system.

### Admin Capabilities

1. **View All Users** - See a list of all registered employees
2. **Create New Users** - Add new employees to the system
3. **Edit User Details** - Update employee information including:
   - Name and email
   - Role (e.g., Backend Developer, HR, Analyst)
   - Years of experience
   - Skills
   - Admin status
4. **Reset Passwords** - Reset any user's password
5. **Delete Users** - Remove users from the system (cannot delete yourself)

---

## How to Create the Admin User

If the admin user doesn't exist, run this command from the `server` folder:

```bash
cd server
venv\Scripts\activate
python create_admin.py
```

This will create the default admin account with:
- Email: admin@zenx.com
- Password: admin123

---

## Admin vs Regular User

| Feature | Regular User | Admin User |
|---------|-------------|------------|
| Login & Dashboard | ✅ | ✅ |
| Edit own profile | ✅ | ✅ |
| Career Path | ✅ | ✅ |
| View all users | ❌ | ✅ |
| Create users | ❌ | ✅ |
| Edit any user | ❌ | ✅ |
| Delete users | ❌ | ✅ |
| Reset passwords | ❌ | ✅ |

---

## Database Schema

The User model includes these fields:

**Admin-Controlled Fields:**
- `is_admin` - Whether user has admin privileges
- `role` - Job role (e.g., Backend Developer)
- `experience` - Years of experience
- `skills` - Comma-separated skills

**User-Controlled Fields:**
- `phone` - Phone number
- `address` - Home address
- `area_of_interest` - Personal interests
- `profile_photo` - Profile picture URL

**System Fields:**
- `name` - Full name
- `email` - Email address (unique)
- `hashed_password` - Encrypted password
- `must_change_password` - Force password change flag
- `created_at` - Account creation date
- `updated_at` - Last update date

---

## API Endpoints for Admin

All admin endpoints require authentication with an admin account:

- `POST /api/admin/users` - Create a new user
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/{id}` - Get specific user
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user

---

## Security Notes

1. **Change Default Password** - The default password (admin123) should be changed immediately
2. **Protect Admin Access** - Only give admin privileges to trusted users
3. **Password Resets** - When admin resets a password, the user is forced to change it on next login
4. **Cannot Delete Self** - Admins cannot delete their own account for safety
5. **JWT Authentication** - All requests use secure JWT tokens

---

## Troubleshooting

### "Not authorized. Admin access required"
- You're logged in as a regular user, not an admin
- Login with admin@zenx.com / admin123

### Admin user doesn't exist
- Run `python create_admin.py` from the server folder
- Make sure the database is initialized

### Forgot admin password
- Delete `employee_portal.db` from the server folder
- Restart the backend server (it will recreate the database)
- Run `python create_admin.py` again

---

## Next Steps

1. Login as admin
2. Change the default password
3. Create user accounts for your team
4. Assign roles and skills to users
5. Let users login and update their personal profiles
