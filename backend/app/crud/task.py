from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from app.model import Task, TaskStatus, TaskPriority
from app.schemas.task import TaskCreate, TaskUpdate

def get_task_by_id(db: Session, task_id: UUID) -> Task | None:
    return db.query(Task).filter(Task.id == task_id).first()

def list_tasks(
    db: Session,
    status: Optional[TaskStatus] = None,
    priority: Optional[TaskPriority] = None,
    assignee_id: Optional[UUID] = None,
) -> list[Task]:
    query = db.query(Task)
    if status is not None:
        query = query.filter(Task.status == status)
    if priority is not None:
        query = query.filter(Task.priority == priority)
    if assignee_id is not None:
        query = query.filter(Task.assignee_id == assignee_id)
    return query.all()

def create_task(db: Session, payload: TaskCreate, creator_id: UUID) -> Task:
    task = Task(
        title=payload.title,
        description=payload.description,
        priority=payload.priority,
        due_date=payload.due_date,
        assignee_id=payload.assignee_id,
        creator_id=creator_id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def update_task(db: Session, db_task: Task, payload: TaskUpdate) -> Task:
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, db_task: Task) -> None:
    db.delete(db_task)
    db.commit()

def assign_task(db: Session, db_task: Task, assignee_id: Optional[UUID]) -> Task:
    db_task.assignee_id = assignee_id
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task_status(db: Session, db_task: Task, status: TaskStatus) -> Task:
    db_task.status = status
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task
