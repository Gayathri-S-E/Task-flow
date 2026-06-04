import api, { APIResponse } from "../api_base";
import { User, UserUpdatePayload } from "../../types/user/user_types";
import { Task } from "../../types/task/task_types";

export const getProfileApi = (): Promise<APIResponse<User>> =>
  api.get("/users/me");

export const updateProfileApi = (data: UserUpdatePayload): Promise<APIResponse<User>> =>
  api.put("/users/me", data);

export const getCreatedTasksApi = (): Promise<APIResponse<Task[]>> =>
  api.get("/users/me/tasks/created");

export const getAssignedTasksApi = (): Promise<APIResponse<Task[]>> =>
  api.get("/users/me/tasks/assigned");

export const getAllUsersApi = (): Promise<APIResponse<User[]>> =>
  api.get("/users");
