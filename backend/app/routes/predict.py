"""
Predict Route - Tera Streamlit ka CORE LOGIC yahan aaya hai.
- Image upload accept karta hai
- Model se prediction leta hai (same logic as predict.py)
- Disease info JSON se fetch karta hai
- Report database mein save karta hai
"""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.core.model_loader import model_loader
from app.services.disease_service import disease_service
from app.models.db_models import ScanReport, User, SubscriptionPlan
from app.schemas.schemas import PredictResponse
import uuid

router = APIRouter()

# Free plan scan limit
FREE_PLAN_LIMIT = 10

@router.post("/", response_model=PredictResponse)
async def predict(
    file: UploadFile = File(...),
    crop_type: str = Query(..., description="'sugarcane' or 'other_crops'"),
    lang: str = Query(default="en", description="'en' or 'hi'"),
    threshold: float = Query(default=60.0, description="Confidence threshold %"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # --- 1. Validate crop_type ---
    if crop_type not in ["sugarcane", "other_crops"]:
        raise HTTPException(status_code=400, detail="crop_type must be 'sugarcane' or 'other_crops'")

    # --- 2. Check free plan limit ---
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.plan == SubscriptionPlan.free and user.scans_used >= FREE_PLAN_LIMIT:
        raise HTTPException(
            status_code=403,
            detail=f"Free plan limit ({FREE_PLAN_LIMIT} scans) reached. Please upgrade to Pro."
        )

    # --- 3. Validate image file ---
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted (jpg, png, etc.)")

    image_bytes = await file.read()
    if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=413, detail="Image size must be under 10MB")

    # --- 4. Run prediction - same logic as tera predict.py ---
    try:
        result = model_loader.predict_from_bytes(image_bytes, crop_type, threshold)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    # --- 5. Fetch disease info from JSON - same as tera app.py ---
    disease_info_data = None
    if result["is_confident"] and result["predicted_class"]:
        disease_info_data = disease_service.get_info(
            disease_key=result["predicted_class"],
            crop_type=crop_type,
            lang=lang
        )

    # --- 6. Save report to DB ---
    report = ScanReport(
        user_id=user.id,
        crop_type=crop_type,
        disease_name=result["predicted_class"] or "Unknown",
        confidence=result["confidence"],
        is_confident=result["is_confident"],
        language=lang,
    )
    db.add(report)

    # Increment scan counter for free users
    user.scans_used += 1
    db.commit()
    db.refresh(report)

    # --- 7. Return full response ---
    return PredictResponse(
        predicted_class=result["predicted_class"] or "Unknown",
        confidence=result["confidence"],
        is_confident=result["is_confident"],
        top3=result["top3"],
        disease_info=disease_info_data,
        report_id=str(report.id)
    )


@router.post("/guest", response_model=PredictResponse)
async def predict_guest(
    file: UploadFile = File(...),
    crop_type: str = Query(...),
    lang: str = Query(default="en"),
    threshold: float = Query(default=60.0),
):
    """
    Guest prediction - no auth required, no DB save.
    Limited to 3 scans per session (frontend handle karega).
    """
    if crop_type not in ["sugarcane", "other_crops"]:
        raise HTTPException(status_code=400, detail="Invalid crop_type")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files accepted")

    image_bytes = await file.read()

    try:
        result = model_loader.predict_from_bytes(image_bytes, crop_type, threshold)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    disease_info_data = None
    if result["is_confident"] and result["predicted_class"]:
        disease_info_data = disease_service.get_info(
            disease_key=result["predicted_class"],
            crop_type=crop_type,
            lang=lang
        )

    return PredictResponse(
        predicted_class=result["predicted_class"] or "Unknown",
        confidence=result["confidence"],
        is_confident=result["is_confident"],
        top3=result["top3"],
        disease_info=disease_info_data,
        report_id=None
    )