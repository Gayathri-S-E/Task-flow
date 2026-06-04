from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.model import User
from app.schemas.user import UserUpdate
from app.crud import user as crud_user

class UserService:
    @staticmethod
    def update_profile(db: Session, current_user: User, payload: UserUpdate) -> User:
        # Email uniqueness check
        if payload.email and payload.email != current_user.email:
            if crud_user.get_user_by_email(db, payload.email):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This email is already registered"
                )
        # Username uniqueness check
        if payload.username and payload.username != current_user.username:
            if crud_user.get_user_by_username(db, payload.username):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This username is already taken"
                )
        return crud_user.update_user(db, current_user, payload)
