import datetime
# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey, JSON, func
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
from app.database import Base

class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="draft", nullable=False)  # "draft" or "published"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    published_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    questions = relationship("Question", back_populates="form", cascade="all, delete-orphan", order_by="Question.position")
    responses = relationship("Response", back_populates="form", cascade="all, delete-orphan")

    @property
    def response_count(self) -> int:
        return len(self.responses)


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False)  # e.g., short_text, long_text, multiple_choice, etc.
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    required = Column(Boolean, default=False, nullable=False)
    position = Column(Integer, default=0, nullable=False)
    settings = Column(JSON, nullable=True)  # Store choice options, rating stars max, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    form = relationship("Form", back_populates="questions")
    answers = relationship("ResponseAnswer", back_populates="question", cascade="all, delete-orphan")


class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    form = relationship("Form", back_populates="responses")
    answers = relationship("ResponseAnswer", back_populates="response", cascade="all, delete-orphan")


class ResponseAnswer(Base):
    __tablename__ = "response_answers"

    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("responses.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    value = Column(Text, nullable=False)  # Stringified value of the answer

    # Relationships
    response = relationship("Response", back_populates="answers")
    question = relationship("Question", back_populates="answers")
