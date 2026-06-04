import { useState } from "react";
import { getAssignedTasksApi } from "../index";
import { Task } from "../../../types/task/task_types";

export const useAssignedTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignedTasks = async (): Promise<Task[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAssignedTasksApi();
      setTasks(res.data);
      return res.data;
    } catch (err: any) {
      setError("Failed to fetch assigned tasks");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { tasks, fetchAssignedTasks, isLoading, error };
};
