export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high";

export interface UserMin {
  id: string;
  username: string;
  email: string;
  full_name?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
  creator_id: string;
  assignee_id?: string | null;
  created_at: string;
  updated_at: string;
  creator?: UserMin | null;
  assignee?: UserMin | null;
}

export interface TaskCreatePayload {
  title: string;
  description?: string;
  priority: TaskPriority;
  due_date?: string;
  assignee_id?: string | null;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  assignee_id?: string | null;
}
