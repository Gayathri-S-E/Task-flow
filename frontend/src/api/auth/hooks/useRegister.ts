import { useState } from "react";
import { registerApi } from "../index";
import { RegisterPayload } from "../../../types/auth/auth_types";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await registerApi(data);
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Registration failed.";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};
