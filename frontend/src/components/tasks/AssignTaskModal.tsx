import React, { useState, useEffect } from "react";
import { useTaskDetail } from "../../api/task/hooks/useTaskDetail";
import { useGetUsers } from "../../api/user/hooks/useGetUsers";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { UserCheck } from "lucide-react";
import toast from "react-hot-toast";

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  currentAssigneeId?: string | null;
}

export const AssignTaskModal: React.FC<AssignTaskModalProps> = ({
  isOpen,
  onClose,
  taskId,
  currentAssigneeId,
}) => {
  const { assignTask } = useTaskDetail();
  const { users, fetchUsers } = useGetUsers();
  const [selectedUserId, setSelectedUserId] = useState(currentAssigneeId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setSelectedUserId(currentAssigneeId || "");
    }
  }, [isOpen, currentAssigneeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const assigneeId = selectedUserId === "" ? null : selectedUserId;
      await assignTask(taskId, assigneeId);
      toast.success(assigneeId ? "Task assigned successfully!" : "Task unassigned successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to assign task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Task">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col space-y-2">
          <label htmlFor="modal_assignee_id" className="text-xs font-semibold uppercase tracking-wider text-dark-400">
            Select Assignee
          </label>
          <select
            id="modal_assignee_id"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="glass-input w-full cursor-pointer"
          >
            <option value="">Unassigned (None)</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.username} (@{u.username})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-dark-800/80">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="flex items-center space-x-1.5">
            <UserCheck className="h-4 w-4" />
            <span>Confirm Assignment</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignTaskModal;
