from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from database import get_db
import models

router = APIRouter(prefix="/api/lessons", tags=["lessons"])

@router.get("", response_model=dict)
def get_lessons(db: Session = Depends(get_db)):
    lessons = db.query(models.Lesson).order_by(models.Lesson.order_index).all()
    
    lessons_list = []
    for lesson in lessons:
        item = {
            "id": lesson.id,
            "title": lesson.title,
            "content": lesson.content,
            "order_index": lesson.order_index,
            "difficulty": lesson.difficulty,
            "goal": lesson.goal,
            "hints": json.loads(lesson.hints) if lesson.hints else [],
            "validation_rules": json.loads(lesson.validation_rules) if lesson.validation_rules else {},
            "example_role": lesson.example_role,
            "example_context": lesson.example_context,
            "example_action": lesson.example_action
        }
        lessons_list.append(item)
        
    return {"success": True, "lessons": lessons_list}

@router.get("/{id}")
def get_lesson(id: int, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    item = {
        "id": lesson.id,
        "title": lesson.title,
        "content": lesson.content,
        "order_index": lesson.order_index,
        "difficulty": lesson.difficulty,
        "goal": lesson.goal,
        "hints": json.loads(lesson.hints) if lesson.hints else [],
        "validation_rules": json.loads(lesson.validation_rules) if lesson.validation_rules else {},
        "example_role": lesson.example_role,
        "example_context": lesson.example_context,
        "example_action": lesson.example_action
    }
    return {"success": True, "lesson": item}

@router.post("/{id}/validate")
def validate_lesson(id: int, payload: dict, db: Session = Depends(get_db)):
    tokenCount = payload.get("tokenCount", 0)
    command = payload.get("command", {})

    lesson = db.query(models.Lesson).filter(models.Lesson.id == id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    rules = json.loads(lesson.validation_rules) if lesson.validation_rules else {}
    passed = True
    feedback = ''

    if rules.get("maxTokens") and tokenCount > rules["maxTokens"]:
        passed = False
        feedback = f'토큰 수가 너무 많습니다. ({tokenCount}/{rules["maxTokens"]}) 더 간결하게 작성해보세요.'

    if rules.get("requiredDevice") and command.get("device") != rules["requiredDevice"]:
        passed = False
        feedback = f'장치가 올바르지 않습니다. "{rules["requiredDevice"]}"를 제어해야 합니다.'

    if rules.get("requiredDevices") and command.get("device") not in rules["requiredDevices"]:
        passed = False
        feedback = f'장치가 올바르지 않습니다. {" 또는 ".join(rules["requiredDevices"])}를 제어해야 합니다.'

    if rules.get("requiresCommand") and (not command or command.get("device") == "none"):
        passed = False
        feedback = '유효한 제어 명령을 생성해야 합니다.'

    if passed:
        feedback = '🎉 축하합니다! 레슨을 완료했습니다!'

    return {"success": True, "passed": passed, "feedback": feedback}
