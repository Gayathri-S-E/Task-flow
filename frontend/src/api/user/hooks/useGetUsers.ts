import { useState } from "react";
import { getAllUsersApi } from "../index";
import { User } from "../../../types/user/user_types";

export const useGetUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (): Promise<User[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAllUsersApi();
      setUsers(res.data);
      return res.data;
    } catch (err: any) {
      setError("Failed to fetch users");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { users, fetchUsers, isLoading, error };
};
