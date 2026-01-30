# Employee Portal

A modern employee portal application with JWT authentication, built with FastAPI backend and Next.js frontend.

## Project Structure

```
employee-portal/
├── client/              # Next.js frontend
│   ├── pages/          # Next.js pages
│   ├── styles/         # CSS styles
│   └── utils/          # Utility functions (auth, etc.)
├── server/             # FastAPI backend
│   ├── main.py         # Main application file
│   ├── auth.py         # Authentication logic
│   ├── database.py     # Database models
│   ├── routes.py       # API routes
│   ├── schemas.py      # Pydantic schemas
│   └── config.py       # Configuration
└── README.md
```

## Features

- ✅ User Registration with name, email, and password
- ✅ User Login with JWT authentication
- ✅ Protected routes (only accessible when logged in)
- ✅ Session management with JWT tokens
- ✅ Modern dark theme UI with Material-UI
- ✅ Fully responsive design
- ✅ SQLite database
- ✅ Password hashing with bcrypt
- ✅ CORS enabled for frontend-backend communication

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database
- **SQLite** - Database
- **python-jose** - JWT token handling
- **passlib** - Password hashing
- **pydantic** - Data validation

### Frontend
- **Next.js** - React framework
- **Material-UI** - Component library
- **JavaScript** - Programming language

## Setup Instructions

### 1. Backend Setup (FastAPI)

#### Navigate to server folder:
```bash
cd server
```

#### Create virtual environment:
```bash
python -m venv venv
```

#### Activate virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

#### Install dependencies:
```bash
pip install -r requirements.txt
```

#### Update .env file:
Open `server/.env` and change the SECRET_KEY to a secure random string (minimum 32 characters).

#### Run the server:
```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload
```

The backend will run at: `http://localhost:8000`

API Documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 2. Frontend Setup (Next.js)

#### Open a new terminal and navigate to client folder:
```bash
cd client
```

#### Install dependencies:
```bash
npm install
```

#### Run the development server:
```bash
npm run dev
```

The frontend will run at: `http://localhost:3000`

## Usage

1. **Start both servers** (backend on port 8000, frontend on port 3000)
2. **Visit** `http://localhost:3000`
3. **Register** a new account at `/register`
4. **Login** with your credentials at `/login`
5. **Access** the protected dashboard at `/dashboard`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (requires token)

### Users
- `GET /api/users/profile` - Get user profile (requires token)

## Authentication Flow

1. User registers with name, email, and password
2. Password is hashed using bcrypt
3. User data is stored in SQLite database
4. User logs in with email and password
5. Backend validates credentials and returns JWT token
6. Frontend stores token in localStorage
7. Token is sent with every request to protected routes
8. Backend validates token and allows/denies access

## Security Features

- Passwords are hashed with bcrypt (never stored in plain text)
- JWT tokens expire after 30 minutes
- Protected routes require valid JWT token
- CORS is configured to only allow requests from localhost:3000
- SQL injection protection via SQLAlchemy ORM

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./employee_portal.db
ALLOWED_ORIGINS=http://localhost:3000
```

## Database

The application uses SQLite database (`employee_portal.db`) which is created automatically when you run the server.

### User Table Schema:
- `id` - Integer (Primary Key)
- `name` - String (Not Null)
- `email` - String (Unique, Not Null)
- `hashed_password` - String (Not Null)
- `created_at` - DateTime
- `updated_at` - DateTime

## Troubleshooting

### Backend Issues:

1. **Port already in use:**
   - Change port in `main.py`: `uvicorn.run(app, host="0.0.0.0", port=8001)`

2. **Database errors:**
   - Delete `employee_portal.db` and restart server to recreate

3. **Import errors:**
   - Make sure virtual environment is activated
   - Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues:

1. **API connection errors:**
   - Make sure backend is running on port 8000
   - Check CORS settings in backend

2. **Module not found:**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

3. **Port already in use:**
   - Change port: `npm run dev -- -p 3001`

## Future Enhancements

- Email verification
- Password reset functionality
- Role-based access control (Admin, Employee, Manager)
- Profile picture upload
- Two-factor authentication
- Remember me functionality
- Activity logs
- Dark/Light theme toggle

## License

MIT License
