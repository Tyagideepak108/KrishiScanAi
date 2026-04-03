from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # App
    APP_NAME: str = "KrishiScan"
    DEBUG: bool = False

    # Database (PostgreSQL)
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/krishiscan"

    # JWT Auth
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS - React frontend URLs
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",
        "https://krishiscan.vercel.app"  # Production frontend
    ]

    # ML Model Paths
    SUGARCANE_MODEL_PATH: str = "models_ml/sugarcane_phase2_best.h5"
    OTHER_CROPS_MODEL_PATH: str = "models_ml/other_crops_model_best.h5"

    # Disease Info JSON paths
    SUGARCANE_INFO_PATH: str = "disease_data/sugercane_info.json"
    OTHER_CROPS_INFO_PATH: str = "disease_data/other_diseases_info.json"

    # Image upload
    MAX_IMAGE_SIZE_MB: int = 10
    UPLOAD_DIR: str = "uploads"

    # Cloudinary (for production image storage)
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # Razorpay (payments)
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""

    class Config:
        env_file = ".env"

settings = Settings()