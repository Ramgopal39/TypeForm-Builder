from fastapi import APIRouter, Depends, status, HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas
from app import services
from app.models import models
from app.routers.auth import get_current_user

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.put("/{id}", response_model=schemas.QuestionResponse)
def update_question_by_id(id: int, question: schemas.QuestionUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = db.query(models.Question).filter(models.Question.id == id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found.")
    
    # Check ownership
    form = db.query(models.Form).filter(models.Form.id == q.form_id).first()
    if form and form.user_id is not None and form.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this question.")

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
def delete_question_by_id(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = db.query(models.Question).filter(models.Question.id == id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found.")
        
    form = db.query(models.Form).filter(models.Form.id == q.form_id).first()
    if form and form.user_id is not None and form.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this question.")

    services.delete_question(db, question_id=id)
    return None
