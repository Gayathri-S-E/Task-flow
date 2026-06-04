from pydantic import EmailStr, field_validator, model_validator
from typing import Optional, Literal
from uuid import UUID
from datetime import datetime
from app.schemas.base import OurBaseModel

class UserBase(OurBaseModel):
    username: str
    email: EmailStr
    full_name: str
    role: Literal["manager", "employee"] = "employee"

class UserCreate(UserBase):
    password: str
    confirm_password: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3 or len(v) > 30:
            raise ValueError("Username must be between 3 and 30 characters")
        import re
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("Username can only contain letters, numbers, and underscores")
        return v

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return v

    @model_validator(mode="after")
    def passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self

class UserUpdate(OurBaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    profile_picture: Optional[str] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip()
        if len(v) < 3 or len(v) > 30:
            raise ValueError("Username must be between 3 and 30 characters")
        import re
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("Username can only contain letters, numbers, and underscores")
        return v

class UserOut(OurBaseModel):
    id: UUID
    username: str
    email: str
    full_name: str
    profile_picture: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
