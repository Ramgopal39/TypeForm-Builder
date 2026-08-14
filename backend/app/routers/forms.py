from fastapi import APIRouter, Depends, status, HTTPException, Request
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import schemas
from app import services
from app.models import models
from app.routers.auth import get_current_user

router = APIRouter(prefix="/forms", tags=["Forms"])

def check_form_owner(db: Session, form_id: int, user_id: int) -> models.Form:
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail=f"Form with ID {form_id} not found.")
    if form.user_id is not None and form.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to manage this form.")
    return form

@router.get("", response_model=List[schemas.FormResponse])
def read_forms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return services.get_forms(db, user_id=current_user.id, skip=skip, limit=limit)

@router.post("", response_model=schemas.FormResponse, status_code=status.HTTP_201_CREATED)
def create_new_form(form: schemas.FormCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return services.create_form(db, form_title=form.title, form_description=form.description, user_id=current_user.id)

@router.get("/{id}", response_model=schemas.FormDetailResponse)
def read_form(id: int, request: Request, db: Session = Depends(get_db)):
    form = services.get_form_by_id(db, form_id=id)
    if form.status == "published":
        return form
        
    # If draft, verify user owns it
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required to view draft form.")
        
    token = auth_header.split(" ")[1]
    session_record = db.query(models.UserSession).filter(models.UserSession.token == token).first()
    if not session_record or session_record.user_id != form.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this form.")
        
    return form

@router.put("/{id}", response_model=schemas.FormResponse)
def update_existing_form(id: int, form: schemas.FormUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    check_form_owner(db, id, current_user.id)
    return services.update_form(
        db, 
        form_id=id, 
        title=form.title, 
        description=form.description, 
        status_str=form.status
    )

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_form(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    check_form_owner(db, id, current_user.id)
    services.delete_form(db, form_id=id)
    return None

@router.post("/{id}/duplicate", response_model=schemas.FormResponse, status_code=status.HTTP_201_CREATED)
def duplicate_existing_form(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    check_form_owner(db, id, current_user.id)
    return services.duplicate_form(db, form_id=id, user_id=current_user.id)

@router.post("/{id}/publish", response_model=schemas.FormResponse)
def publish_existing_form(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    check_form_owner(db, id, current_user.id)
    return services.publish_form(db, form_id=id)

@router.post("/{id}/unpublish", response_model=schemas.FormResponse)
def unpublish_existing_form(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    check_form_owner(db, id, current_user.id)
    return services.unpublish_form(db, form_id=id)

# Question-related endpoints nested under form
@router.get("/{id}/questions", response_model=List[schemas.QuestionResponse])
def read_form_questions(id: int, request: Request, db: Session = Depends(get_db)):
    form = services.get_form_by_id(db, form_id=id)
    if form.status != "published":
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Authentication required to view draft questions.")
            
        token = auth_header.split(" ")[1]
        session_record = db.query(models.UserSession).filter(models.UserSession.token == token).first()
        if not session_record or session_record.user_id != form.user_id:
            raise HTTPException(status_code=403, detail="Not authorized to view these questions.")
            
    return services.get_questions_by_form(db, form_id=id)

@router.post("/{id}/questions", response_model=schemas.QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_form_question(id: int, question: schemas.QuestionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    check_form_owner(db, id, current_user.id)
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
def reorder_form_questions(id: int, reorders: List[schemas.QuestionReorder], db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    check_form_owner(db, id, current_user.id)
    reorder_payload = [{"id": item.id, "position": item.position} for item in reorders]
    return services.reorder_questions(db, form_id=id, reorders=reorder_payload)
