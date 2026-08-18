import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "AI-Powered Personal Farming Assistant"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api"

    # Security
    SECRET_KEY: str = "farming-assistant-super-secret-key-change-in-production-btech-project"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database
    # Supports PostgreSQL, or SQLite fallback for immediate out-of-the-box local execution
    DATABASE_URL: str = "sqlite:///./farming.db"

    # AI & External APIs
    GEMINI_API_KEY: str = ""
    WEATHER_API_URL: str = "https://api.open-meteo.com/v1/forecast"

    # Storage & Uploads
    UPLOAD_DIR: str = "static/uploads"
    MAX_IMAGE_SIZE_MB: int = 10

    # ML Inference
    MODEL_DIR: str = "app/ml/saved_models"
    DISEASE_CONFIDENCE_THRESHOLD: float = 0.55

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
