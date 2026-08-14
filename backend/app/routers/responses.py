from fastapi import APIRouter, Depends, status, Response
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import schemas 
from app import services

router = APIRouter(tags=["Responses"])

@router.get("/forms/{id}/responses", response_model=List[schemas.ResponseDetailResponse])
def read_form_responses(id: int, db: Session = Depends(get_db)):
    return services.get_responses_by_form(db, form_id=id)

@router.get("/forms/{id}/responses/csv")
def export_form_responses_csv(id: int, db: Session = Depends(get_db)):
    csv_content = services.generate_responses_csv(db, form_id=id)
    headers = {
        'Content-Disposition': f'attachment; filename="responses_form_{id}.csv"',
        'Access-Control-Expose-Headers': 'Content-Disposition'
    }
    return Response(content=csv_content, media_type="text/csv", headers=headers)

@router.get("/responses/{id}", response_model=schemas.ResponseDetailResponse)
def read_response(id: int, db: Session = Depends(get_db)):
    return services.get_response_by_id(db, response_id=id)

@router.post("/public/forms/{id}/responses", response_model=schemas.ResponseDetailResponse, status_code=status.HTTP_201_CREATED)
def submit_form_response(id: int, submission: schemas.ResponseCreate, db: Session = Depends(get_db)):
    return services.submit_response(db, form_id=id, answers_data=submission.answers)
