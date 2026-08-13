import re
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import Response, ResponseAnswer, Form, Question
from app.schemas import ResponseAnswerCreate
from typing import List

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

def get_responses_by_form(db: Session, form_id: int):
    # Verify form exists
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with ID {form_id} not found."
        )
    return db.query(Response).filter(Response.form_id == form_id).all()

def get_response_by_id(db: Session, response_id: int):
    res = db.query(Response).filter(Response.id == response_id).first()
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Response with ID {response_id} not found."
        )
    return res

def submit_response(db: Session, form_id: int, answers_data: List[ResponseAnswerCreate]):
    # 1. Fetch form and verify it is published
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with ID {form_id} not found."
        )
    
    if form.status != "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Submissions are not allowed on unpublished forms."
        )

    # 2. Fetch all questions for this form
    questions = db.query(Question).filter(Question.form_id == form_id).all()
    questions_map = {q.id: q for q in questions}
    
    # 3. Build lookup mapping for submitted answers
    submitted_answers_map = {a.question_id: a.value for a in answers_data}
    
    # 4. Perform Server-Side Validations
    
    # Validate that all submitted answers actually belong to questions in this form
    for ans in answers_data:
        if ans.question_id not in questions_map:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Question ID {ans.question_id} does not belong to Form ID {form_id}."
            )

    # Validate required fields, email formatting, and numeric inputs
    for q_id, question in questions_map.items():
        val = submitted_answers_map.get(q_id)
        is_empty = val is None or str(val).strip() == ""
        
        # Validate Required questions
        if question.required and is_empty:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Question '{question.title}' (ID {q_id}) is required but was not answered."
            )
            
        if not is_empty:
            # Validate Email questions
            if question.type == "email":
                if not EMAIL_REGEX.match(val):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Value for '{question.title}' (ID {q_id}) is not a valid email address."
                    )
            
            # Validate Number questions
            elif question.type == "number":
                try:
                    float(val)
                except ValueError:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Value for '{question.title}' (ID {q_id}) must be a valid number."
                    )

    # 5. Transactionally save Response and ResponseAnswers
    new_response = Response(form_id=form_id)
    db.add(new_response)
    db.flush()  # Obtain new_response.id before committing

    for ans in answers_data:
        db_answer = ResponseAnswer(
            response_id=new_response.id,
            question_id=ans.question_id,
            value=ans.value
        )
        db.add(db_answer)

    db.commit()
    db.refresh(new_response)
    return new_response
