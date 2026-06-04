import { useState } from "react";
import {
  getTaskApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  assignTaskApi,
  updateStatusApi,
} from "../index";
import useTaskStore from "../../../store/taskStore";
import { Task, TaskCreatePayload, TaskUpdatePayload, TaskStatus } from "../../../types/task/task_types";

export const useTaskDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTask = useTaskStore((s) => s.currentTask);
  const setCurrentTask = useTaskStore((s) => s.setCurrentTask);
  const tasks = useTaskStore((s) => s.tasks);
  const setTasks = useTaskStore((s) => s.setTasks);

  const fetchTaskById = async (id: string): Promise<Task> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getTaskApi(id);
      setCurrentTask(res.data);
      return res.data;
    } catch (err: any) {
      setError("Failed to fetch task details");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (data: TaskCreatePayload): Promise<Task> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await createTaskApi(data);
      setTasks([res.data, ...tasks]);
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to create task";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, data: TaskUpdatePayload): Promise<Task> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await updateTaskApi(id, data);
      setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
      if (currentTask?.id === id) {
        setCurrentTask(res.data);
      }
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to update task";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteTaskApi(id);
      setTasks(tasks.filter((t) => t.id !== id));
      if (currentTask?.id === id) {
        setCurrentTask(null);
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to delete task";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const assignTask = async (id: string, assigneeId: string | null): Promise<Task> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await assignTaskApi(id, assigneeId);
      setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
      if (currentTask?.id === id) {
        setCurrentTask(res.data);
      }
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to assign task";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await updateStatusApi(id, status);
      setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
      if (currentTask?.id === id) {
        setCurrentTask(res.data);
      }
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to update status";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentTask,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    updateTaskStatus,
    setCurrentTask,
    isLoading,
    error,
  };
};
