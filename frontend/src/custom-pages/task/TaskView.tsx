import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import TaskFilters from "../../components/tasks/TaskFilters";
import TaskCard from "../../components/tasks/TaskCard";
import TaskForm from "../../components/tasks/TaskForm";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { useTasks } from "../../api/task/hooks/useTasks";
import useAuthStore from "../../store/authStore";
import { Plus, ListTodo } from "lucide-react";
import Spinner from "../../components/ui/Spinner";

export const TaskView: React.FC = () => {
  const { tasks, fetchTasks, isLoading } = useTasks();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const isManager = user?.role === "manager";

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
                <ListTodo className="h-8 w-8 text-brand-500" />
                <span>Tasks Control Room</span>
              </h1>
              <p className="text-sm text-dark-400 mt-1.5 font-normal">
                {isManager ? "Manage, delegate, filter, and track tasks." : "View and update your assigned tasks."}
              </p>
            </div>

            {isManager && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-1.5"
              >
                <Plus className="h-4.5 w-4.5" />
                <span>Create Task</span>
              </Button>
            )}
          </div>

          {/* Filters */}
          <TaskFilters />

          {/* Tasks Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner className="h-10 w-10 text-brand-500" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-24 glass-panel rounded-2xl border border-dark-850 max-w-xl mx-auto space-y-4">
              <div className="p-4 bg-dark-800/40 rounded-full inline-block text-dark-400 border border-dark-750">
                <ListTodo className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">No tasks found</h3>
              <p className="text-sm text-dark-400 max-w-sm mx-auto font-normal">
                {isManager
                  ? "Try refining your filters or create a brand new task to get started!"
                  : "You have no assigned tasks right now."}
              </p>
              {isManager && (
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2"
                >
                  Create Task
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}

          {/* Create Task Modal */}
          {isManager && (
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Create New Task"
            >
              <TaskForm onSubmitSuccess={() => {
                setIsModalOpen(false);
                fetchTasks(); // refresh
              }} />
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};

export default TaskView;
