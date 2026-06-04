from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from uuid import UUID
from app.model import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password

def get_user_by_id(db: Session, user_id: UUID) -> User | None:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def get_all_users(db: Session) -> list[User]:
    return db.query(User).all()

def create_user(db: Session, payload: UserCreate) -> User:
    user = User(
        username=payload.username,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_user(db: Session, db_user: User, payload: UserUpdate) -> User:
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)
    # Explicitly set updated_at since onupdate only fires on raw SQL UPDATE
    db_user.updated_at = func.now()
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
