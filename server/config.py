from pathlib import Path

from pydantic_settings import BaseSettings

# Load .env from the server directory (same folder as this config file)
_env_path = Path(__file__).resolve().parent / ".env"


class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    class Config:
        env_file = _env_path
        env_file_encoding = "utf-8"

settings = Settings()
