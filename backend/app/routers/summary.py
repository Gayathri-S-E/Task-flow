from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user, get_current_manager
from app.model import User, Task, TaskStatus
from app.schemas.response import APIResponse

router = APIRouter(prefix="/summary", tags=["Summary"])

@router.get("", response_model=APIResponse[dict])
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager),
):
    """Retrieve summary metrics for the dashboard."""
    total_users = db.query(User).count()
    total_tasks = db.query(Task).count()
    pending_tasks = db.query(Task).filter(Task.status == TaskStatus.pending).count()
    in_progress_tasks = db.query(Task).filter(Task.status == TaskStatus.in_progress).count()
    completed_tasks = db.query(Task).filter(Task.status == TaskStatus.completed).count()
    tasks_created_by_me = db.query(Task).filter(Task.creator_id == current_user.id).count()
    tasks_assigned_to_me = db.query(Task).filter(Task.assignee_id == current_user.id).count()
    
    summary_data = {
        "total_users": total_users,
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "in_progress_tasks": in_progress_tasks,
        "completed_tasks": completed_tasks,
        "tasks_created_by_me": tasks_created_by_me,
        "tasks_assigned_to_me": tasks_assigned_to_me,
    }
    return APIResponse(data=summary_data)
