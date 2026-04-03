from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.model_loader import model_loader
from app.routes import auth, predict, reports, users, disease_info

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load both ML models into memory once
    print("Loading ML models...")
    model_loader.load_models()
    print("Models loaded successfully!")
    yield
    # Shutdown cleanup (if needed)
    print("Shutting down...")

app = FastAPI(
    title="KrishiScan API",
    description="Plant Disease Detection API - Sugarcane & Other Crops",
    version="1.0.0",
    lifespan=lifespan,
    swagger_ui_init_oauth={},
    components={"securitySchemes": {"BearerAuth": {"type": "http", "scheme": "bearer"}}}
)

# CORS - Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all route modules
app.include_router(auth.router,         prefix="/api/auth",         tags=["Authentication"])
app.include_router(users.router,        prefix="/api/users",        tags=["Users"])
app.include_router(predict.router,      prefix="/api/predict",      tags=["Prediction"])
app.include_router(reports.router,      prefix="/api/reports",      tags=["Reports"])
app.include_router(disease_info.router, prefix="/api/disease-info", tags=["Disease Info"])

@app.get("/")
def root():
    return {"message": "KrishiScan API is running!", "docs": "/docs"}

@app.get("/health")
def health():
    return {
        "status": "ok",
        "models_loaded": model_loader.models_ready()
    }