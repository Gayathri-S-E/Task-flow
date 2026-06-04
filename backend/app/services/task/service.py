from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from app.model import User, Task, TaskStatus, TaskPriority
from app.schemas.task import TaskCreate, TaskUpdate
from app.crud import task as crud_task, user as crud_user

class TaskService:
    @staticmethod
    def create_task(db: Session, payload: TaskCreate, creator_id: UUID) -> Task:
        if payload.assignee_id:
            assignee = crud_user.get_user_by_id(db, payload.assignee_id)
            if not assignee:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Assignee user not found"
                )
        return crud_task.create_task(db, payload, creator_id)

    @staticmethod
    def list_tasks(
        db: Session,
        current_user: User,
        status: Optional[TaskStatus] = None,
        priority: Optional[TaskPriority] = None,
        assignee_id: Optional[UUID] = None,
    ) -> list[Task]:
        if current_user.role == "employee":
            return crud_task.list_tasks(db, status=status, priority=priority, assignee_id=current_user.id)
        return crud_task.list_tasks(db, status=status, priority=priority, assignee_id=assignee_id)

    @staticmethod
    def get_task(db: Session, task_id: UUID, current_user: User) -> Task:
        task = crud_task.get_task_by_id(db, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        if current_user.role == "employee" and task.assignee_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Employees can only view their own assigned tasks"
            )
        return task

    @staticmethod
    def update_task(db: Session, task_id: UUID, payload: TaskUpdate, current_user: User) -> Task:
        task = crud_task.get_task_by_id(db, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        if task.creator_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only creator can update task"
            )
        if payload.assignee_id:
            assignee = crud_user.get_user_by_id(db, payload.assignee_id)
            if not assignee:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Assignee user not found"
                )
        return crud_task.update_task(db, task, payload)

    @staticmethod
    def delete_task(db: Session, task_id: UUID, current_user: User) -> None:
        task = crud_task.get_task_by_id(db, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        if task.creator_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only creator can delete task"
            )
        crud_task.delete_task(db, task)

    @staticmethod
    def assign_task(db: Session, task_id: UUID, assignee_id: UUID | None, current_user: User) -> Task:
        task = crud_task.get_task_by_id(db, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        if task.creator_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only creator can assign task"
            )
        if assignee_id is not None:
            assignee = crud_user.get_user_by_id(db, assignee_id)
            if not assignee:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Assignee user not found"
                )
        return crud_task.assign_task(db, task, assignee_id)

    @staticmethod
    def update_status(db: Session, task_id: UUID, status_val: TaskStatus, current_user: User) -> Task:
        task = crud_task.get_task_by_id(db, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        if task.assignee_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only assignee can update status"
            )
        return crud_task.update_task_status(db, task, status_val)
