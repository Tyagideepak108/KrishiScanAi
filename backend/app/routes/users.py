from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import User
from app.schemas.schemas import UserResponse, UpdateUserRequest

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/me", response_model=UserResponse)
def update_me(
    payload: UpdateUserRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if payload.name:
        user.name = payload.name
    if payload.phone:
        user.phone = payload.phone
    if payload.language:
        user.language = payload.language
    db.commit()
    db.refresh(user)
    return user