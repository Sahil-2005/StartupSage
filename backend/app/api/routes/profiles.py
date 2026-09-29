import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db.mongo import db

router = APIRouter()

class StartupProfile(BaseModel):
    name: str
    industry: str
    stage: str
    location: str
    notes: Optional[str] = ""

from app.api.routes.auth import get_current_user
from fastapi import Depends

@router.post("/")
async def save_profile(profile: StartupProfile, current_user: dict = Depends(get_current_user)):
    profile_id = str(uuid.uuid4())
    doc = profile.model_dump()
    doc["_id"] = profile_id
    doc["user_id"] = current_user["_id"]
    
    if db.db is not None:
        await db.db.startup_profiles.insert_one(doc)
        # Update user with their active profile ID
        await db.db.users.update_one(
            {"_id": current_user["_id"]}, 
            {"$set": {"startup_profile_id": profile_id}}
        )
        return {"profile_id": profile_id, "message": "Profile saved successfully"}
    
    raise HTTPException(status_code=500, detail="Database not connected")

@router.get("/{profile_id}")
async def get_profile(profile_id: str):
    if db.db is not None:
        profile = await db.db.startup_profiles.find_one({"_id": profile_id})
        if profile:
            profile["id"] = profile.pop("_id")
            return profile
            
    raise HTTPException(status_code=404, detail="Profile not found")
