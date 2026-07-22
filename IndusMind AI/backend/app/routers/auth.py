from fastapi import APIRouter, HTTPException, status
from app.models.schemas import LoginRequest, TokenResponse
from app.core.security import create_access_token, get_password_hash

router = APIRouter(prefix="/auth", tags=["1. Authentication"])

# Mock database
DEMO_USERS = {
    "engineer@indusmind.ai": {
        "email": "engineer@indusmind.ai",
        "name": "Dr. Aris Thorne",
        "role": "Reliability Engineer",
        "hashed_password": get_password_hash("password123")
    },
    "manager@indusmind.ai": {
        "email": "manager@indusmind.ai",
        "name": "Vikram Sharma",
        "role": "Plant Manager",
        "hashed_password": get_password_hash("password123")
    }
}

@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    user = DEMO_USERS.get(credentials.email)
    if not user or credentials.password != "password123":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid corporate credentials or unauthorized role"
        )
    
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user={
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "unit": "Gujarat Refinery - Plant 04"
        }
    )
