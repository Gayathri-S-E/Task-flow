import { useState } from "react";
import { loginApi } from "../index";
import { getProfileApi } from "../../user";
import useAuthStore from "../../../store/authStore";
import { User } from "../../../types/user/user_types";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await loginApi(email, password);
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      setToken(token);

      const profileRes = await getProfileApi();
      const profile = profileRes.data;
      setUser(profile);
      return profile;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Invalid email or password";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
