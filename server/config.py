from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

# Load .env from the server directory (same folder as this config file)
_env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(_env_path)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_env_path),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Required; use defaults so server starts even if .env is missing or not loaded
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = "sqlite:///./employee_portal.db"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"


settings = Settings()
