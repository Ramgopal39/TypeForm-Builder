# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import Question, Form
from typing import List, Dict, Any

VALID_QUESTION_TYPES = {
    "short_text",
    "long_text",
    "multiple_choice",
    "dropdown",
    "email",
    "number",
    "yes_no",
    "rating"
}

def validate_question_type(q_type: str):
    if q_type not in VALID_QUESTION_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid question type '{q_type}'. Allowed types: {list(VALID_QUESTION_TYPES)}"
        )

def get_questions_by_form(db: Session, form_id: int):
    # Verify form exists first
    form_exists = db.query(Form).filter(Form.id == form_id).first()
    if not form_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with ID {form_id} not found."
        )
    return db.query(Question).filter(Question.form_id == form_id).order_by(Question.position).all()

def get_question_by_id(db: Session, question_id: int):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question with ID {question_id} not found."
        )
    return question

def create_question(
    db: Session, 
    form_id: int, 
    type_str: str, 
    title: str, 
    description: str = None, 
    required: bool = False, 
    position: int = None, 
    settings: Dict[str, Any] = None
):
    # Verify form exists
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with ID {form_id} not found."
        )
    
    validate_question_type(type_str)

    # Auto-calculate position if not specified
    if position is None:
        max_pos = db.query(Question.position).filter(Question.form_id == form_id).order_by(Question.position.desc()).first()
        position = (max_pos[0] + 1) if max_pos else 1

    new_question = Question(
        form_id=form_id,
        type=type_str,
        title=title,
        description=description,
        required=required,
        position=position,
        settings=settings
    )
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question

def update_question(
    db: Session, 
    question_id: int, 
    type_str: str = None,
    title: str = None,
    description: str = None,
    required: bool = None,
    position: int = None,
    settings: Dict[str, Any] = None
):
    question = get_question_by_id(db, question_id)
    
    if type_str is not None:
        validate_question_type(type_str)
        question.type = type_str
    if title is not None:
        question.title = title
    if description is not None:
        question.description = description
    if required is not None:
        question.required = required
    if position is not None:
        question.position = position
    if settings is not None:
        # For dictionary merge or replacement
        question.settings = settings

    db.commit()
    db.refresh(question)
    return question

def delete_question(db: Session, question_id: int):
    question = get_question_by_id(db, question_id)
    db.delete(question)
    db.commit()
    return True

def reorder_questions(db: Session, form_id: int, reorders: List[Dict[str, int]]):
    # Verify form exists
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with ID {form_id} not found."
        )
        
    # Get all form questions
    form_questions = {q.id: q for q in db.query(Question).filter(Question.form_id == form_id).all()}

    # Perform updates transactionally
    for item in reorders:
        q_id = item.get("id")
        q_pos = item.get("position")
        if q_id not in form_questions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Question with ID {q_id} does not belong to form {form_id}."
            )
        form_questions[q_id].position = q_pos

    db.commit()
    return list(form_questions.values())
