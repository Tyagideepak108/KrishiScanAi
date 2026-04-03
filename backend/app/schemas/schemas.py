from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# ---------- Auth ----------
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    language: Optional[str] = "en"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    email: str
    plan: str

# ---------- User ----------
class UserResponse(BaseModel):
    id: UUID
    name: str
    email: str
    phone: Optional[str]
    language: str
    plan: str
    scans_used: int
    created_at: datetime

    class Config:
        from_attributes = True

class UpdateUserRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    language: Optional[str] = None

# ---------- Prediction ----------
class Top3Prediction(BaseModel):
    disease: str
    confidence: float

class PredictResponse(BaseModel):
    predicted_class: str
    confidence: float
    is_confident: bool
    top3: List[Top3Prediction]
    disease_info: Optional[dict] = None   # JSON se fetched info
    report_id: Optional[str] = None       # saved report ka ID

# ---------- Scan Reports ----------
class FeedbackRequest(BaseModel):
    report_id: UUID
    is_correct: bool
    comment: Optional[str] = None

class ScanReportResponse(BaseModel):
    id: UUID
    crop_type: str
    disease_name: str
    confidence: float
    is_confident: bool
    language: str
    image_url: Optional[str]
    feedback_correct: Optional[bool]
    created_at: datetime

    class Config:
        from_attributes = True

# ---------- Disease Info ----------
class DiseaseInfoResponse(BaseModel):
    disease_key: str
    hindi_name: Optional[str]
    cause: Optional[str]
    cause_hindi: Optional[str]
    organic_treatment: List[str]
    organic_treatment_en: List[str]
    chemical_treatment: List[str]
    chemical_treatment_en: List[str]
    preventive_measures: List[str]
    preventive_measures_en: List[str]