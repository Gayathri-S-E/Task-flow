import api, { APIResponse } from "../api_base";
import { Task, TaskCreatePayload, TaskUpdatePayload, TaskStatus } from "../../types/task/task_types";

export interface TaskFilterParams {
  status?: string;
  priority?: string;
  assignee_id?: string;
}

export const getTasksApi = (params?: TaskFilterParams): Promise<APIResponse<Task[]>> =>
  api.get("/tasks", { params });

export const getTaskApi = (id: string): Promise<APIResponse<Task>> =>
  api.get(`/tasks/${id}`);

export const createTaskApi = (data: TaskCreatePayload): Promise<APIResponse<Task>> =>
  api.post("/tasks", data);

export const updateTaskApi = (id: string, data: TaskUpdatePayload): Promise<APIResponse<Task>> =>
  api.put(`/tasks/${id}`, data);

export const deleteTaskApi = (id: string): Promise<APIResponse<null>> =>
  api.delete(`/tasks/${id}`);

export const assignTaskApi = (id: string, assignee_id: string | null): Promise<APIResponse<Task>> =>
  api.patch(`/tasks/${id}/assign`, { assignee_id });

export const updateStatusApi = (id: string, status: TaskStatus): Promise<APIResponse<Task>> =>
  api.patch(`/tasks/${id}/status`, { status });
