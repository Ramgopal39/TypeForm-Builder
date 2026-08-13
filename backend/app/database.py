import os
# pyrefly: ignore [missing-import]
from sqlalchemy import create_engine
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.declarative import declarative_base
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import sessionmaker
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv  

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Resolve default or relative SQLite paths to the backend folder
if not DATABASE_URL:
    # Default to typeform.db inside the backend directory
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(backend_dir, "typeform.db")
    DATABASE_URL = f"sqlite:///{db_path}"
elif DATABASE_URL.startswith("sqlite:///./") or DATABASE_URL.startswith("sqlite:///"):
    # If it is a relative sqlite path, resolve it relative to backend directory
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # Extract the database file name (e.g. typeform.db)
    db_name = DATABASE_URL.replace("sqlite:///./", "").replace("sqlite:///", "")
    db_path = os.path.join(backend_dir, db_name)
    DATABASE_URL = f"sqlite:///{db_path}"

# SQLite requires check_same_thread=False for multiple threads
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL, connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
