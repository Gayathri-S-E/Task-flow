from typing import Optional
from app.schemas.base import OurBaseModel

class Token(OurBaseModel):
    access_token: str
    token_type: str

class TokenData(OurBaseModel):
    user_id: Optional[str] = None
