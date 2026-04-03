from fastapi import APIRouter, Query, HTTPException
from app.services.disease_service import disease_service

router = APIRouter()

@router.get("/")
def list_diseases(crop_type: str = Query(..., description="'sugarcane' or 'other_crops'")):
    """Ek crop ke saare diseases ki list"""
    if crop_type not in ["sugarcane", "other_crops"]:
        raise HTTPException(status_code=400, detail="Invalid crop_type")
    return {"diseases": disease_service.list_diseases(crop_type)}

@router.get("/{disease_key}")
def get_disease_info(
    disease_key: str,
    crop_type: str = Query(...),
    lang: str = Query(default="en", description="'en' or 'hi'")
):
    """Single disease ki poori info - prevention, treatment"""
    if crop_type not in ["sugarcane", "other_crops"]:
        raise HTTPException(status_code=400, detail="Invalid crop_type")

    info = disease_service.get_info(disease_key, crop_type, lang)
    if not info:
        raise HTTPException(status_code=404, detail=f"Disease '{disease_key}' not found")
    return info