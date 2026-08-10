from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
import datetime


# ---------- Auth ----------

class SignupIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Skills ----------

class SkillOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class SkillIn(BaseModel):
    name: str
    proficiency: int = Field(default=3, ge=1, le=5)


# ---------- User / Profile ----------

class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    college: Optional[str] = None
    looking_for: Optional[List[str]] = None   # e.g. ["hackathons", "startup"]
    portfolio_url: Optional[str] = None
    skills: Optional[List[SkillIn]] = None


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    college: str
    bio: str
    looking_for: List[str]
    portfolio_url: str
    rating_score: int
    skills: List[dict]
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class MatchOut(BaseModel):
    user: UserOut
    match_score: int
    shared_skills: List[str]
    shared_interests: List[str]


# ---------- Connections ----------

class ConnectionOut(BaseModel):
    id: int
    status: str
    created_at: datetime.datetime
    other_user: UserOut

    class Config:
        from_attributes = True
