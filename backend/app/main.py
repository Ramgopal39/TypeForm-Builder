from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health
from app.database import engine, Base

# Create all tables on startup (ensures schemas are created)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Typeform Builder API", version="1.0.0")

# Configure CORS for Next.js frontend development
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["System"])

from app.routers import forms, questions, responses, auth
app.include_router(auth.router, prefix="/api")
app.include_router(forms.router, prefix="/api")
app.include_router(questions.router, prefix="/api")
app.include_router(responses.router, prefix="/api")


if __name__ == "__main__":  
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
