export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  profile_picture?: string | null;
  role: "manager" | "employee";
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface UserUpdatePayload {
  full_name?: string;
  username?: string;
  email?: string;
  profile_picture?: string;
}
