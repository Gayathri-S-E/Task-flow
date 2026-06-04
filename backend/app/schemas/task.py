from typing import Optional
from uuid import UUID
from datetime import datetime
from app.schemas.base import OurBaseModel
from app.model import TaskStatus, TaskPriority

class UserMin(OurBaseModel):
    id: UUID
    username: str
    email: str
    full_name: Optional[str] = None

class TaskBase(OurBaseModel):
    title: str
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.medium
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    assignee_id: Optional[UUID] = None

class TaskUpdate(OurBaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    assignee_id: Optional[UUID] = None

class TaskAssign(OurBaseModel):
    assignee_id: Optional[UUID] = None

class TaskStatusUpdate(OurBaseModel):
    status: TaskStatus

class TaskOut(TaskBase):
    id: UUID
    status: TaskStatus
    creator_id: UUID
    assignee_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    creator: Optional[UserMin] = None
    assignee: Optional[UserMin] = None
