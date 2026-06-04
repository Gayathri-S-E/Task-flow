from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import verify_password, create_access_token
from app.schemas.user import UserCreate
from app.schemas.token import Token
from app.crud import user as crud_user

class AuthService:
    @staticmethod
    def register_user(db: Session, payload: UserCreate):
        if crud_user.get_user_by_email(db, payload.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        if crud_user.get_user_by_username(db, payload.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        return crud_user.create_user(db, payload)

    @staticmethod
    def login_user(db: Session, email: str, password_raw: str) -> Token:
        user = crud_user.get_user_by_email(db, email)
        if not user or not verify_password(password_raw, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        token = create_access_token(data={"sub": str(user.id)})
        return Token(access_token=token, token_type="bearer")
