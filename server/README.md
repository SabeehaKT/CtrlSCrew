# Employee Portal Server

Backend API for Employee Portal with JWT Authentication

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Update the `.env` file with your configuration (especially the SECRET_KEY)

5. Run the server:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload
```

The server will start at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)

## Database

The application uses SQLite by default. The database file `employee_portal.db` will be created automatically when you run the server.
