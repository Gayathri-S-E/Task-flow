import { useState } from "react";
import { getTasksApi } from "../index";
import useTaskStore from "../../../store/taskStore";
import { Task } from "../../../types/task/task_types";

export const useTasks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tasks = useTaskStore((s) => s.tasks);
  const setTasks = useTaskStore((s) => s.setTasks);
  const filters = useTaskStore((s) => s.filters);
  const setStoreFilters = useTaskStore((s) => s.setFilters);
  const resetStoreFilters = useTaskStore((s) => s.resetFilters);

  const fetchTasks = async (customFilters?: any): Promise<Task[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const activeFilters: any = {};
      const statusFilter = customFilters?.status !== undefined ? customFilters.status : filters.status;
      const priorityFilter = customFilters?.priority !== undefined ? customFilters.priority : filters.priority;
      const assigneeFilter = customFilters?.assignee_id !== undefined ? customFilters.assignee_id : filters.assignee_id;

      if (statusFilter) activeFilters.status = statusFilter;
      if (priorityFilter) activeFilters.priority = priorityFilter;
      if (assigneeFilter) activeFilters.assignee_id = assigneeFilter;

      const res = await getTasksApi(activeFilters);
      setTasks(res.data);
      return res.data;
    } catch (err: any) {
      setError("Failed to fetch tasks");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (newFilters: any) => {
    setStoreFilters(newFilters);
    // Fetch with updated values immediately
    fetchTasks({ ...filters, ...newFilters });
  };

  const resetFilters = () => {
    resetStoreFilters();
    fetchTasks({ status: "", priority: "", assignee_id: "" });
  };

  return {
    tasks,
    filters,
    updateFilters,
    resetFilters,
    fetchTasks,
    isLoading,
    error,
  };
};
