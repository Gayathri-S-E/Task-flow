export interface Token {
  access_token: string;
  token_type: string;
}

export interface TokenData {
  user_id?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  full_name: string;
  role: "manager" | "employee";
  password?: string;
  confirm_password?: string;
}
