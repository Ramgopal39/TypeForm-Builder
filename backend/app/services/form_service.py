import datetime
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import Form, Question

def get_forms(db: Session, user_id: int = None, skip: int = 0, limit: int = 100):
    query = db.query(Form)
    if user_id is not None:
        query = query.filter(Form.user_id == user_id)
    return query.offset(skip).limit(limit).all()

def get_form_by_id(db: Session, form_id: int):
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with ID {form_id} not found."
        )
    return form

def create_form(db: Session, form_title: str, form_description: str = None, user_id: int = None):
    new_form = Form(title=form_title, description=form_description, status="draft", user_id=user_id)
    db.add(new_form)
    db.commit()
    db.refresh(new_form)
    return new_form

def update_form(db: Session, form_id: int, title: str = None, description: str = None, status_str: str = None):
    form = get_form_by_id(db, form_id)
    
    if title is not None:
        form.title = title
    if description is not None:
        form.description = description
    if status_str is not None:
        if status_str not in ["draft", "published"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid form status. Must be 'draft' or 'published'."
            )
        form.status = status_str
        if status_str == "published":
            form.published_at = datetime.datetime.now(datetime.timezone.utc)
        else:
            form.published_at = None

    db.commit()
    db.refresh(form)
    return form

def delete_form(db: Session, form_id: int):
    form = get_form_by_id(db, form_id)
    db.delete(form)
    db.commit()
    return True

def publish_form(db: Session, form_id: int):
    return update_form(db, form_id, status_str="published")

def unpublish_form(db: Session, form_id: int):
    return update_form(db, form_id, status_str="draft")

def duplicate_form(db: Session, form_id: int, user_id: int = None):
    # Fetch original form
    original_form = get_form_by_id(db, form_id)
    
    # Create duplicate form structure (default status to draft)
    duplicated_form = Form(
        title=f"Copy of {original_form.title}",
        description=original_form.description,
        status="draft",
        user_id=user_id or original_form.user_id
    )
    db.add(duplicated_form)
    db.flush()  # Generates duplicated_form.id inside transaction
    
    # Copy questions
    for original_question in original_form.questions:
        dup_question = Question(
            form_id=duplicated_form.id,
            type=original_question.type,
            title=original_question.title,
            description=original_question.description,
            required=original_question.required,
            position=original_question.position,
            settings=original_question.settings
        )
        db.add(dup_question)
    
    db.commit()
    db.refresh(duplicated_form)
    return duplicated_form
