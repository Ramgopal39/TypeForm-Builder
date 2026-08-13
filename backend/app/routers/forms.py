from fastapi import APIRouter, Depends, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import schemas
from app import services

router = APIRouter(prefix="/forms", tags=["Forms"])

@router.get("", response_model=List[schemas.FormResponse])
def read_forms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return services.get_forms(db, skip=skip, limit=limit)

@router.post("", response_model=schemas.FormResponse, status_code=status.HTTP_201_CREATED)
def create_new_form(form: schemas.FormCreate, db: Session = Depends(get_db)):
    return services.create_form(db, form_title=form.title, form_description=form.description)

@router.get("/{id}", response_model=schemas.FormDetailResponse)
def read_form(id: int, db: Session = Depends(get_db)):
    return services.get_form_by_id(db, form_id=id)

@router.put("/{id}", response_model=schemas.FormResponse)
def update_existing_form(id: int, form: schemas.FormUpdate, db: Session = Depends(get_db)):
    return services.update_form(
        db, 
        form_id=id, 
        title=form.title, 
        description=form.description, 
        status_str=form.status
    )

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_form(id: int, db: Session = Depends(get_db)):
    services.delete_form(db, form_id=id)
    return None

@router.post("/{id}/duplicate", response_model=schemas.FormResponse, status_code=status.HTTP_201_CREATED)
def duplicate_existing_form(id: int, db: Session = Depends(get_db)):
    return services.duplicate_form(db, form_id=id)

@router.post("/{id}/publish", response_model=schemas.FormResponse)
def publish_existing_form(id: int, db: Session = Depends(get_db)):
    return services.publish_form(db, form_id=id)

@router.post("/{id}/unpublish", response_model=schemas.FormResponse)
def unpublish_existing_form(id: int, db: Session = Depends(get_db)):
    return services.unpublish_form(db, form_id=id)

# Question-related endpoints nested under form
@router.get("/{id}/questions", response_model=List[schemas.QuestionResponse])
def read_form_questions(id: int, db: Session = Depends(get_db)):
    return services.get_questions_by_form(db, form_id=id)

@router.post("/{id}/questions", response_model=schemas.QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_form_question(id: int, question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return services.create_question(
        db,
        form_id=id,
        type_str=question.type,
        title=question.title,
        description=question.description,
        required=question.required,
        position=question.position,
        settings=question.settings
    )

@router.put("/{id}/questions/reorder", response_model=List[schemas.QuestionResponse])
def reorder_form_questions(id: int, reorders: List[schemas.QuestionReorder], db: Session = Depends(get_db)):
    reorder_payload = [{"id": item.id, "position": item.position} for item in reorders]
    return services.reorder_questions(db, form_id=id, reorders=reorder_payload)
