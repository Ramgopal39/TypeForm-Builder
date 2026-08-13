from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    """Health check endpoint to verify backend status."""
    return {"status": "ok"}
