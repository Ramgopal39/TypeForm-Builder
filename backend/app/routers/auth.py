import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter(prefix="/auth", tags=["Authentication"])

# --- Helper Functions ---
def generate_salt() -> str:
    return secrets.token_hex(16)

def hash_password(password: str, salt: str) -> str:
    # Secure PBKDF2 with SHA-256 (no external dependencies needed)
    return hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000
    ).hex()

def generate_session_token() -> str:
    return secrets.token_urlsafe(32)

# --- Dependency to Get Current User ---
def get_current_user(request: Request, db: Session = Depends(get_db)) -> models.User:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid"
        )
    
    token = auth_header.split(" ")[1]
    
    # Query session
    session_record = db.query(models.UserSession).filter(models.UserSession.token == token).first()
    if not session_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session token"
        )
        
    # Check expiry
    # Use timezone-aware UTC comparison
    now = datetime.now(timezone.utc)
    # Ensure expires_at has UTC timezone info
    expires_at = session_record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
        
    if expires_at < now:
        db.delete(session_record)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session token expired"
        )
        
    return session_record.user

# --- Endpoints ---
@router.post("/signup", response_model=schemas.TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(user_data: schemas.UserSignup, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user_data.email.lower().strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered"
        )
        
    # Create user
    salt = generate_salt()
    hashed_pwd = hash_password(user_data.password, salt)
    
    new_user = models.User(
        email=user_data.email.lower().strip(),
        hashed_password=hashed_pwd,
        salt=salt,
        name=user_data.name.strip()
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create session token (valid for 30 days)
    token = generate_session_token()
    expiry = datetime.now(timezone.utc) + timedelta(days=30)
    
    new_session = models.UserSession(
        token=token,
        user_id=new_user.id,
        expires_at=expiry
    )
    
    db.add(new_session)
    db.commit()
    
    return {"token": token, "user": new_user}

@router.post("/login", response_model=schemas.TokenResponse)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    email = credentials.email.lower().strip()
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    # Verify password
    hashed_pwd = hash_password(credentials.password, user.salt)
    if hashed_pwd != user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    # Generate session
    token = generate_session_token()
    expiry = datetime.now(timezone.utc) + timedelta(days=30)
    
    new_session = models.UserSession(
        token=token,
        user_id=user.id,
        expires_at=expiry
    )
    
    db.add(new_session)
    db.commit()
    
    return {"token": token, "user": user}

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout(request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        session_record = db.query(models.UserSession).filter(models.UserSession.token == token).first()
        if session_record:
            db.delete(session_record)
            db.commit()
            
    return {"message": "Logged out successfully"}
