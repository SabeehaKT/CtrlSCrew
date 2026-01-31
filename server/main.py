from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import init_db
from routes import auth_router, user_router

# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    print("Database initialized successfully")
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
    import socket
    import uvicorn

    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8000"))

    # If port 8000 is in use (common on Windows), use 8001 so server starts without error
    def is_port_in_use(p):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", p))
                return False
            except OSError:
                return True

    if port == 8000 and is_port_in_use(8000):
        port = 8001
        print(f"Port 8000 in use, using {port}. Backend: http://127.0.0.1:{port}")

    # reload=False avoids multiprocessing PermissionError on some Windows setups
    uvicorn.run("main:app", host=host, port=port, reload=False)
