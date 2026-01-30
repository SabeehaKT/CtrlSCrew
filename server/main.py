from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import init_db
from routes import auth_router, user_router, admin_router
from database import SessionLocal, User
from auth import get_password_hash

# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    print("Database initialized successfully")
    
    # Create default admin if not exists
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@zenx.com").first()
        if not admin:
            admin_user = User(
                name="Admin",
                email="admin@zenx.com",
                hashed_password=get_password_hash("admin123"),
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
            print("Default admin created: admin@zenx.com / admin123")
    finally:
        db.close()
    
    yield
    # Shutdown (if needed)
    print("Shutting down...")

# Initialize FastAPI app
app = FastAPI(
    title="Employee Portal API",
    description="Backend API for Employee Portal with JWT Authentication",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(user_router, prefix="/api/users", tags=["Users"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Employee Portal API",
        "version": "1.0.0",
        "status": "running"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import os
    import uvicorn

    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8000"))

    # On Windows, port 8000 can hit WinError 10013; try 8001 as fallback
    try:
        uvicorn.run("main:app", host=host, port=port, reload=True)
    except OSError as e:
        if e.winerror == 10013 and port == 8000:
            port = 8001
            print(f"Port 8000 unavailable, using {port}. Backend: http://127.0.0.1:{port}")
            uvicorn.run("main:app", host=host, port=port, reload=True)
        else:
            raise
