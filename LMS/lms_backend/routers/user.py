from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from database import get_db
import models

router = APIRouter(prefix="/api/user", tags=["user"])

@router.get("/{user_id}/progress")
def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"success": True, "user": {"progress": user.progress}}

@router.post("/{user_id}/complete-lesson")
def complete_lesson(user_id: int, payload: dict, db: Session = Depends(get_db)):
    lesson_id = payload.get("lessonId")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    progress = json.loads(user.progress or '{"completed": 0, "total": 5}')
    
    if progress.get("completed", 0) < lesson_id:
        progress["completed"] = lesson_id
        
    user.progress = json.dumps(progress)
    db.commit()
    db.refresh(user)
    
    return {"success": True, "progress": progress}
