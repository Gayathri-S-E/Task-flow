from typing import Generic, TypeVar, Optional
from app.schemas.base import OurBaseModel

T = TypeVar("T")

class APIResponse(OurBaseModel, Generic[T]):
    success: bool = True
    message: Optional[str] = None
    data: Optional[T] = None
