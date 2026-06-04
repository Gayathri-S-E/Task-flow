from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from app.db.session import get_db
from app.core.dependencies import get_current_user, get_current_manager
from app.model import TaskStatus, TaskPriority, User
from app.schemas.task import TaskCreate, TaskOut, TaskUpdate, TaskAssign, TaskStatusUpdate
from app.schemas.response import APIResponse
from app.services.task.service import TaskService

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("", response_model=APIResponse[TaskOut], status_code=201)
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager),
):
    """Create a new task. Restrained to Managers. The manager is set as the creator."""
    task = TaskService.create_task(db, payload, current_user.id)
    return APIResponse(success=True, message="Task created successfully", data=task)

@router.get("", response_model=APIResponse[list[TaskOut]])
def list_tasks(
    status: Optional[TaskStatus] = None,
    priority: Optional[TaskPriority] = None,
    assignee_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List tasks. If caller is an Employee, returns ONLY tasks assigned to them."""
    tasks = TaskService.list_tasks(db, current_user, status=status, priority=priority, assignee_id=assignee_id)
    return APIResponse(data=tasks)

@router.get("/{task_id}", response_model=APIResponse[TaskOut])
def get_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve a specific task by its ID. Employees can only retrieve their assigned tasks."""
    task = TaskService.get_task(db, task_id, current_user)
    return APIResponse(data=task)

@router.put("/{task_id}", response_model=APIResponse[TaskOut])
def update_task(
    task_id: UUID,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager),
):
    """Update task details. Restricted to Managers. Only the creator of the task can update it."""
    updated_task = TaskService.update_task(db, task_id, payload, current_user)
    return APIResponse(success=True, message="Task updated successfully", data=updated_task)

@router.delete("/{task_id}", response_model=APIResponse[None])
def delete_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager),
):
    """Delete a task. Restricted to Managers. Only the creator can delete it."""
    TaskService.delete_task(db, task_id, current_user)
    return APIResponse(success=True, message="Task deleted successfully")

@router.patch("/{task_id}/assign", response_model=APIResponse[TaskOut])
def assign_task(
    task_id: UUID,
    payload: TaskAssign,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager),
):
    """Assign task to a user. Restricted to Managers. Only the creator can assign it."""
    assigned_task = TaskService.assign_task(db, task_id, payload.assignee_id, current_user)
    return APIResponse(success=True, message="Task assignment updated", data=assigned_task)

@router.patch("/{task_id}/status", response_model=APIResponse[TaskOut])
def update_status(
    task_id: UUID,
    payload: TaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update task status. Only the assignee can update the status."""
    updated_task = TaskService.update_status(db, task_id, payload.status, current_user)
    return APIResponse(success=True, message="Task status updated", data=updated_task)
