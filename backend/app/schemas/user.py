from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, examples=["Kailas Nair"])
    email: EmailStr = Field(..., examples=["farmer@example.com"])
    preferred_language: str = Field(default="en", pattern="^(en|ml)$", examples=["ml"])
    location: Optional[str] = Field(default=None, max_length=150, examples=["Palakkad, Kerala"])
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=128, examples=["StrongFarmerPass123"])


class UserLogin(BaseModel):
    email: EmailStr = Field(..., examples=["farmer@example.com"])
    password: str = Field(..., examples=["StrongFarmerPass123"])


class UserUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    preferred_language: Optional[str] = Field(default=None, pattern="^(en|ml)$")
    location: Optional[str] = Field(default=None, max_length=150)
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class UserOut(UserBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
