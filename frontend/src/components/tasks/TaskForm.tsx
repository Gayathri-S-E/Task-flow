import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTaskDetail } from "../../api/task/hooks/useTaskDetail";
import { useGetUsers } from "../../api/user/hooks/useGetUsers";
import { PRIORITY_OPTIONS } from "../../utils/constants";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";
import { Task } from "../../types/task/task_types";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  due_date: z.string().nullable().optional(),
  assignee_id: z.string().nullable().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task | null;
  onSubmitSuccess?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task = null, onSubmitSuccess }) => {
  const { createTask, updateTask } = useTaskDetail();
  const { users, fetchUsers } = useGetUsers();

  const isEdit = !!task;

  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "medium",
      due_date: task?.due_date ? task.due_date.substring(0, 10) : "",
      assignee_id: task?.assignee_id || "",
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (values: TaskFormValues) => {
    try {
      const payload: any = {
        title: values.title,
        description: values.description || null,
        priority: values.priority,
        due_date: values.due_date ? new Date(values.due_date).toISOString() : null,
        assignee_id: values.assignee_id && values.assignee_id !== "" ? values.assignee_id : null,
      };

      if (isEdit && task) {
        await updateTask(task.id, payload);
        toast.success("Task updated successfully!");
      } else {
        await createTask(payload);
        toast.success("Task created successfully!");
      }
      
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "An error occurred while saving the task.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <Input
        id="title"
        label="Task Title"
        placeholder="Enter task title"
        error={errors.title?.message}
        {...register("title")}
      />

      {/* Description */}
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-dark-450">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Describe the task details..."
          rows={4}
          className={`glass-input resize-none w-full ${
            errors.description ? "border-red-500/60 focus:border-red-500 focus:ring-red-500" : ""
          }`}
          {...register("description")}
        />
        {errors.description && (
          <span className="text-xs text-red-450 font-medium mt-0.5">{errors.description.message}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="priority" className="text-xs font-semibold uppercase tracking-wider text-dark-450">
            Priority
          </label>
          <select
            id="priority"
            className="glass-input cursor-pointer"
            {...register("priority")}
          >
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="due_date" className="text-xs font-semibold uppercase tracking-wider text-dark-450">
            Due Date
          </label>
          <input
            id="due_date"
            type="date"
            className="glass-input cursor-pointer"
            {...register("due_date")}
          />
        </div>
      </div>

      {/* Assignee Selection */}
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="assignee_id" className="text-xs font-semibold uppercase tracking-wider text-dark-450">
          Assignee
        </label>
        <select
          id="assignee_id"
          className="glass-input cursor-pointer"
          {...register("assignee_id")}
        >
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.full_name || u.username} (Ref: @{u.username})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-3 border-t border-dark-800/80">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full md:w-auto"
        >
          {isEdit ? "Save Changes" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
