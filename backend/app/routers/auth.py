from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import UserCreate, UserOut
from app.schemas.token import Token
from app.schemas.response import APIResponse
from app.services.auth.service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=APIResponse[UserOut], status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    user = AuthService.register_user(db, payload)
    return APIResponse(success=True, message="User registered successfully", data=user)


@router.post("/login", response_model=APIResponse[Token])
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # form.username carries the email value (OAuth2 standard field name)
    token_obj = AuthService.login_user(db, form.username, form.password)
    return APIResponse(
        success=True,
        message="Login successful",
        data=token_obj
    )
