import api, { APIResponse } from "../api_base";
import { Token, RegisterPayload } from "../../types/auth/auth_types";
import { User } from "../../types/user/user_types";

export const loginApi = (email: string, password: string): Promise<APIResponse<Token>> =>
  api.post("/auth/login", new URLSearchParams({ username: email, password }), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

export const registerApi = (data: RegisterPayload): Promise<APIResponse<User>> =>
  api.post("/auth/register", data);
