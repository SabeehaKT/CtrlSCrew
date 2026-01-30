# HOW TO RUN THE EMPLOYEE PORTAL

Follow these steps exactly:

## STEP 1: Setup Backend (Python/FastAPI)

1. Open a terminal/command prompt

2. Navigate to the server folder:
   ```bash
   cd "c:\Users\TinuCMathew(G10XIND)\OneDrive - G10X Technology Private Limited\Desktop\employee-portal\server"
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

4. Activate the virtual environment:
   ```bash
   venv\Scripts\activate
   ```
   (You should see `(venv)` at the beginning of your command line)

5. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

6. **IMPORTANT**: Generate a secure secret key:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
   Copy the output and paste it in the `.env` file replacing `your-secret-key-here-change-in-production`

7. Start the backend server:
   ```bash
   python main.py
   ```

   You should see: "Database initialized successfully"
   Server running at: http://localhost:8000

**KEEP THIS TERMINAL OPEN!**

---

## STEP 2: Setup Frontend (Next.js)

1. Open a **NEW** terminal/command prompt (don't close the first one!)

2. Navigate to the client folder:
   ```bash
   cd "c:\Users\TinuCMathew(G10XIND)\OneDrive - G10X Technology Private Limited\Desktop\employee-portal\client"
   ```

3. Install Node.js dependencies:
   ```bash
   npm install
   ```
   (This will take a few minutes)

4. Start the frontend server:
   ```bash
   npm run dev
   ```

   You should see: "ready - started server on 0.0.0.0:3000"
   Frontend running at: http://localhost:3000

**KEEP THIS TERMINAL OPEN TOO!**

---

## STEP 3: Use the Application

1. Open your web browser

2. Go to: **http://localhost:3000**

3. Click the **"Login"** button in the top-right corner

4. Click **"Register here"** link (since you don't have an account yet)

5. Fill in the registration form:
   - Full Name: Your name
   - Email: your.email@example.com
   - Password: Choose a password (minimum 6 characters)
   - Confirm Password: Same password

6. Click **"Register"**

7. You'll be redirected to the login page

8. Enter your email and password

9. Click **"Login"**

10. You'll see the Dashboard with a welcome message!

---

## Quick Commands Summary

### Terminal 1 (Backend):
```bash
cd server
venv\Scripts\activate
python main.py
```

### Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

---

## Troubleshooting

### "Python not found"
Install Python from: https://www.python.org/downloads/
Make sure to check "Add Python to PATH" during installation

### "npm not found" 
Install Node.js from: https://nodejs.org/
This will install npm automatically

### Port 8000 already in use
Change the port in `server/main.py` line 49:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Port 3000 already in use
Run frontend on different port:
```bash
npm run dev -- -p 3001
```

### "Unable to acquire lock" when running `npm run dev`
Another instance of Next.js is already running. Either:
1. **Close the other terminal** where `npm run dev` is running, then run it again in this terminal, or
2. **Remove the lock file** (Windows, from project root):  
   `Remove-Item -Force CtrlSCrew\client\.next\dev\lock -ErrorAction SilentlyContinue`  
   Then run `cd CtrlSCrew\client` and `npm run dev` again.

### Backend won't connect to frontend
Make sure both servers are running and check:
- Backend: http://localhost:8000/health
- Frontend: http://localhost:3000

---

## Need Help?

Check the following:
1. Both terminals are still open and running
2. No error messages in the terminals
3. Backend shows "Database initialized successfully"
4. Frontend shows "ready - started server"
5. Browser is open at http://localhost:3000
