import uuid
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from app.db.mongo import db
from app.core.security import verify_password, get_password_hash, create_access_token, decode_token

logger = logging.getLogger(__name__)
router = APIRouter()
security = HTTPBearer(auto_error=False)


class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    user = await db.db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    if db.db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    existing = await db.db.users.find_one({"email": request.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user_id = str(uuid.uuid4())
    hashed_pw = get_password_hash(request.password)

    user_doc = {
        "_id": user_id,
        "full_name": request.full_name,
        "email": request.email.lower(),
        "hashed_password": hashed_pw,
        "created_at": datetime.utcnow(),
        "avatar_initials": request.full_name[:2].upper(),
    }
    await db.db.users.insert_one(user_doc)

    token = create_access_token({"sub": user_id})
    safe_user = {k: v for k, v in user_doc.items() if k not in ["hashed_password", "_id"]}
    safe_user["id"] = user_id

    return AuthResponse(access_token=token, user=safe_user)


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    if db.db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    user = await db.db.users.find_one({"email": request.email.lower()})
    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token({"sub": user["_id"]})
    safe_user = {k: v for k, v in user.items() if k not in ["hashed_password", "_id"]}
    safe_user["id"] = user["_id"]

    return AuthResponse(access_token=token, user=safe_user)


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    safe_user = {k: v for k, v in current_user.items() if k not in ["hashed_password", "_id"]}
    safe_user["id"] = current_user["_id"]
    return safe_user
