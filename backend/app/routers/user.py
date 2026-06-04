from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user, get_current_manager
from app.model import User
from app.schemas.user import UserOut, UserUpdate
from app.schemas.task import TaskOut
from app.schemas.response import APIResponse
from app.crud import user as crud_user
from app.services.user.service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=APIResponse[list[UserOut]])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_manager)):
    """Retrieve all users in the system (useful for task assignment, restricted to Managers)."""
    users = crud_user.get_all_users(db)
    return APIResponse(data=users)


@router.get("/me", response_model=APIResponse[UserOut])
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Retrieve the current logged-in user profile."""
    return APIResponse(data=current_user)


@router.put("/me", response_model=APIResponse[UserOut])
def update_my_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update current user profile information."""
    updated_user = UserService.update_profile(db, current_user, payload)
    return APIResponse(success=True, message="Profile updated successfully", data=updated_user)


@router.get("/me/tasks/created", response_model=APIResponse[list[TaskOut]])
def get_created_tasks(current_user: User = Depends(get_current_user)):
    """Get all tasks created by the current user."""
    return APIResponse(data=current_user.created_tasks)


@router.get("/me/tasks/assigned", response_model=APIResponse[list[TaskOut]])
def get_assigned_tasks(current_user: User = Depends(get_current_user)):
    """Get all tasks assigned to the current user."""
    return APIResponse(data=current_user.assigned_tasks)
