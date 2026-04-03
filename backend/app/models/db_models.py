from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, Integer, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime
import uuid
import enum

class SubscriptionPlan(str, enum.Enum):
    free = "free"
    pro = "pro"
    business = "business"

class User(Base):
    __tablename__ = "users"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name          = Column(String(100), nullable=False)
    email         = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    phone         = Column(String(20), nullable=True)
    language      = Column(String(5), default="en")          # "en" or "hi"
    plan          = Column(Enum(SubscriptionPlan), default=SubscriptionPlan.free)
    scans_used    = Column(Integer, default=0)                # free plan limit tracking
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    reports = relationship("ScanReport", back_populates="user", cascade="all, delete-orphan")

class ScanReport(Base):
    __tablename__ = "scan_reports"

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id          = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    crop_type        = Column(String(50), nullable=False)      # "sugarcane" or "other_crops"
    disease_name     = Column(String(200), nullable=False)     # predicted class name
    confidence       = Column(Float, nullable=False)
    is_confident     = Column(Boolean, default=True)
    language         = Column(String(5), default="en")
    image_url        = Column(String(500), nullable=True)      # Cloudinary URL
    feedback_correct = Column(Boolean, nullable=True)          # user ka feedback
    feedback_comment = Column(Text, nullable=True)
    created_at       = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="reports")