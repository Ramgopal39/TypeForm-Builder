from fastapi import APIRouter, Depends, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas
from app import services

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.put("/{id}", response_model=schemas.QuestionResponse)
def update_question_by_id(id: int, question: schemas.QuestionUpdate, db: Session = Depends(get_db)):
    return services.update_question(
        db,
        question_id=id,
        type_str=question.type,
        title=question.title,
        description=question.description,
        required=question.required,
        position=question.position,
        settings=question.settings
    )

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question_by_id(id: int, db: Session = Depends(get_db)):
    services.delete_question(db, question_id=id)
    return None
