# Quick Start Guide

## First Time Setup

### 1. Backend Setup (Python/FastAPI)

Open a terminal and run:

```bash
# Navigate to server folder
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# IMPORTANT: Edit .env file and change SECRET_KEY to a random string

# Run the server
python main.py
```

The backend will be running at: http://localhost:8000

---

### 2. Frontend Setup (Next.js)

Open a NEW terminal (keep backend running) and run:

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be running at: http://localhost:3000

---

## Subsequent Runs

### Start Backend:
```bash
cd server
venv\Scripts\activate  # Windows
python main.py
```

### Start Frontend (in a new terminal):
```bash
cd client
npm run dev
```

---

## Testing the Application

1. Open browser: http://localhost:3000
2. Click "Login" button in navigation
3. Click "Register here" to create account
4. Fill in: Name, Email, Password
5. After registration, you'll be redirected to login
6. Login with your credentials
7. You'll be redirected to the dashboard

---

## Troubleshooting

**Backend won't start:**
- Make sure Python is installed: `python --version`
- Make sure virtual environment is activated
- Check if port 8000 is already in use

**Frontend won't start:**
- Make sure Node.js is installed: `node --version`
- Delete node_modules and run `npm install` again
- Check if port 3000 is already in use

**Can't login:**
- Make sure backend is running at http://localhost:8000
- Check browser console for errors
- Try registering a new account

---

## API Documentation

Once backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
