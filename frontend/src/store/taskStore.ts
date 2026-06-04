import { create } from "zustand";
import { Task } from "../types/task/task_types";

interface TaskFilters {
  status: string;
  priority: string;
  assignee_id: string;
}

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  setCurrentTask: (task: Task | null) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  resetFilters: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  currentTask: null,
  filters: {
    status: "",
    priority: "",
    assignee_id: "",
  },
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),
  setCurrentTask: (currentTask) => set({ currentTask }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () =>
    set({
      filters: {
        status: "",
        priority: "",
        assignee_id: "",
      },
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useTaskStore;
