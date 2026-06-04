import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import TaskStatusBadge from "../../components/tasks/TaskStatusBadge";
import AssignTaskModal from "../../components/tasks/AssignTaskModal";
import TaskForm from "../../components/tasks/TaskForm";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { useTaskDetail } from "../../api/task/hooks/useTaskDetail";
import useAuthStore from "../../store/authStore";
import { formatDueDate, formatFullDateTime } from "../../utils/formatDate";
import { STATUS_OPTIONS, PRIORITY_COLORS, PRIORITY_OPTIONS } from "../../utils/constants";
import {
  ArrowLeft,
  Calendar,
  User,
  AlertTriangle,
  Edit,
  Trash,
  UserPlus,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

export const TaskDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { user: currentUser } = useAuthStore();
  const {
    currentTask,
    fetchTaskById,
    updateTaskStatus,
    deleteTask,
    isLoading,
  } = useTaskDetail();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTaskById(id).catch(() => {
        toast.error("Task not found or unauthorized.");
        navigate("/tasks");
      });
    }
  }, [id]);

  if (isLoading && !currentTask) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col font-sans">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <Spinner className="h-10 w-10 text-brand-500" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentTask) return null;

  const isCreator = currentTask.creator_id === currentUser?.id && currentUser?.role === "manager";
  const isAssignee = currentTask.assignee_id === currentUser?.id;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as any;
    try {
      await updateTaskStatus(currentTask.id, newStatus);
      toast.success("Task status updated!");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to update status.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setIsDeleting(true);
    try {
      await deleteTask(currentTask.id);
      toast.success("Task deleted successfully!");
      navigate("/tasks");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to delete task.");
    } finally {
      setIsDeleting(false);
    }
  };

  const priorityColor = (PRIORITY_COLORS as any)[currentTask.priority] || "bg-dark-800 text-dark-300";
  const priorityLabel = PRIORITY_OPTIONS.find((o) => o.value === currentTask.priority)?.label || currentTask.priority;

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-dark-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          {/* Details Card */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-8 bg-dark-900 border border-dark-850">
            {/* Header info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-dark-800/80">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <TaskStatusBadge status={currentTask.status} />
                  
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${priorityColor}`}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {priorityLabel}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
                  {currentTask.title}
                </h1>
              </div>

              {/* Action Buttons (Creator Only) */}
              {isCreator && (
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => setIsAssignModalOpen(true)}
                    className="flex items-center space-x-1.5 text-xs py-2 px-4 rounded-xl flex-1 md:flex-none"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Assign</span>
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center space-x-1.5 text-xs py-2 px-4 rounded-xl flex-1 md:flex-none"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    className="flex items-center space-x-1.5 text-xs py-2 px-4 rounded-xl flex-1 md:flex-none"
                  >
                    <Trash className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Description</h3>
              <p className="text-sm md:text-base text-dark-200 leading-relaxed font-normal bg-dark-950/40 p-5 rounded-2xl border border-dark-850">
                {currentTask.description || "No description provided for this task."}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-dark-900/40 p-6 rounded-2xl border border-dark-850">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="h-4.5 w-4.5 text-dark-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-dark-500 uppercase">Due Date</span>
                    <span className="text-white font-medium">{formatDueDate(currentTask.due_date)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <User className="h-4.5 w-4.5 text-dark-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-dark-500 uppercase">Assignee</span>
                    <span className="text-white font-medium">
                      {currentTask.assignee
                        ? `${currentTask.assignee.full_name || currentTask.assignee.username} (@${currentTask.assignee.username})`
                        : "Unassigned"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <User className="h-4.5 w-4.5 text-dark-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-dark-500 uppercase">Created By</span>
                    <span className="text-white font-medium">
                      {currentTask.creator
                        ? `${currentTask.creator.full_name || currentTask.creator.username} (@${currentTask.creator.username})`
                        : "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4.5 w-4.5 text-dark-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-dark-500 uppercase">Timeline</span>
                    <span className="text-xs text-dark-300 font-normal">
                      Created: {formatFullDateTime(currentTask.created_at)}
                      {currentTask.updated_at && (
                        <>
                          <br />
                          Last Update: {formatFullDateTime(currentTask.updated_at)}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Transition Control (Assignee Only) */}
            {isAssignee ? (
              <div className="p-6 bg-brand-500/5 rounded-2xl border border-brand-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Update Progress</h4>
                  <p className="text-xs text-dark-400 font-normal">
                    As the assignee of this task, you can update its status.
                  </p>
                </div>

                <select
                  value={currentTask.status}
                  onChange={handleStatusChange}
                  className="glass-input py-2 px-4 text-sm w-48 cursor-pointer bg-dark-900 border-brand-500/25 text-brand-300 focus:ring-brand-500 font-semibold"
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="p-4 bg-dark-950/20 rounded-2xl border border-dark-850 text-center">
                <p className="text-xs text-dark-500 font-normal">
                  {isCreator 
                    ? "Assign a team member to let them manage task progress status."
                    : "Only the assigned user can update the progress status of this task."
                  }
                </p>
              </div>
            )}
          </div>

          {/* Edit Task Modal */}
          {isCreator && (
            <Modal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              title="Edit Task Details"
            >
              <TaskForm
                task={currentTask}
                onSubmitSuccess={() => {
                  setIsEditModalOpen(false);
                  if (id) fetchTaskById(id);
                }}
              />
            </Modal>
          )}

          {/* Assign Task Modal */}
          {isCreator && (
            <AssignTaskModal
              isOpen={isAssignModalOpen}
              onClose={() => {
                setIsAssignModalOpen(false);
                if (id) fetchTaskById(id);
              }}
              taskId={currentTask.id}
              currentAssigneeId={currentTask.assignee_id}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default TaskDetailView;
