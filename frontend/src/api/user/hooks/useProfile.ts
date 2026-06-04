import { useState } from "react";
import { getProfileApi, updateProfileApi } from "../index";
import useAuthStore from "../../../store/authStore";
import { UserUpdatePayload, User } from "../../../types/user/user_types";

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const fetchProfile = async (): Promise<User | null> => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getProfileApi();
      setUser(res.data);
      return res.data;
    } catch (err: any) {
      localStorage.removeItem("token");
      setUser(null);
      setError("Failed to fetch profile");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UserUpdatePayload): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await updateProfileApi(data);
      setUser(res.data);
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to update profile";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { user, fetchProfile, updateProfile, isLoading, error };
};
