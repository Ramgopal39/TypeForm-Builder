from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Any, Dict

# --- ResponseAnswer Schemas ---
class ResponseAnswerBase(BaseModel):
    question_id: int
    value: str

class ResponseAnswerCreate(ResponseAnswerBase):
    pass

class ResponseAnswerResponse(ResponseAnswerBase):
    id: int
    response_id: int

    class Config:
        from_attributes = True


# --- Response Schemas ---
class ResponseBase(BaseModel):
    form_id: int

class ResponseCreate(BaseModel):
    answers: List[ResponseAnswerCreate]

class ResponseResponse(ResponseBase):
    id: int
    submitted_at: datetime

    class Config:
        from_attributes = True

class ResponseDetailResponse(ResponseResponse):
    answers: List[ResponseAnswerResponse]

    class Config:
        from_attributes = True


# --- Question Schemas ---
class QuestionBase(BaseModel):
    type: str  # short_text, long_text, multiple_choice, dropdown, email, number, yes_no, rating
    title: str
    description: Optional[str] = None
    required: bool = False
    position: int = 0
    settings: Optional[Dict[str, Any]] = None  # Store option lists, ratings, etc.

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    required: Optional[bool] = None
    position: Optional[int] = None
    settings: Optional[Dict[str, Any]] = None

class QuestionResponse(QuestionBase):
    id: int
    form_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class QuestionReorder(BaseModel):
    id: int
    position: int


# --- Form Schemas ---
class FormBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "draft"  # "draft" or "published"

class FormCreate(FormBase):
    pass

class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class FormResponse(FormBase):
    id: int
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    response_count: int = 0

    class Config:
        from_attributes = True

class FormDetailResponse(FormResponse):
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True


# --- User & Auth Schemas ---
class UserSignup(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    token: str
    user: UserResponse
