from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import ScanReport
from app.schemas.schemas import ScanReportResponse, FeedbackRequest
import uuid

router = APIRouter()

@router.get("/", response_model=List[ScanReportResponse])
def get_my_reports(
    skip: int = Query(default=0),
    limit: int = Query(default=20),
    crop_type: Optional[str] = Query(default=None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """User ke saare scan reports - tera prediction history page"""
    query = db.query(ScanReport).filter(ScanReport.user_id == current_user["user_id"])
    if crop_type:
        query = query.filter(ScanReport.crop_type == crop_type)
    reports = query.order_by(ScanReport.created_at.desc()).offset(skip).limit(limit).all()
    return reports

@router.get("/{report_id}", response_model=ScanReportResponse)
def get_report(
    report_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = db.query(ScanReport).filter(
        ScanReport.id == report_id,
        ScanReport.user_id == current_user["user_id"]
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.post("/feedback")
def submit_feedback(
    payload: FeedbackRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Tera Yes/No feedback - same as Streamlit app"""
    report = db.query(ScanReport).filter(
        ScanReport.id == payload.report_id,
        ScanReport.user_id == current_user["user_id"]
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.feedback_correct = payload.is_correct
    report.feedback_comment = payload.comment
    db.commit()
    return {"message": "Feedback saved. Thank you!"}

@router.delete("/{report_id}")
def delete_report(
    report_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = db.query(ScanReport).filter(
        ScanReport.id == report_id,
        ScanReport.user_id == current_user["user_id"]
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"message": "Report deleted"}