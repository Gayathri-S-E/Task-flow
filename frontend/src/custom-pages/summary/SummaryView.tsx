import React, { useEffect } from "react";
import { useNavigate as useReactRouterNavigate, Link as ReactRouterLink } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import StatCard from "../../components/dashboard/StatCard";
import { useSummary } from "../../api/summary/hooks/useSummary";
import { useAssignedTasks } from "../../api/user/hooks/useAssignedTasks";
import {
  Users,
  ClipboardList,
  Hourglass,
  Activity,
  CheckCircle,
  PlusCircle,
  User,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";
import TaskStatusBadge from "../../components/tasks/TaskStatusBadge";
import { formatDueDate } from "../../utils/formatDate";
import useAuthStore from "../../store/authStore";

export const SummaryView: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useReactRouterNavigate();
  const { summary, fetchSummary, isLoading: summaryLoading } = useSummary();
  const { tasks: myTasks, fetchAssignedTasks, isLoading: tasksLoading } = useAssignedTasks();

  useEffect(() => {
    if (user && user.role === "employee") {
      navigate("/tasks", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "manager") {
      fetchSummary();
      fetchAssignedTasks();
    }
  }, [user]);

  const loading = summaryLoading || tasksLoading;

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.full_name || user?.username}!
              </h1>
              <p className="text-sm text-dark-400 mt-1.5 font-normal">
                Here's a summary of what's happening in your projects today.
              </p>
            </div>
            <ReactRouterLink
              to="/tasks"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-brand-500/20 active:scale-[0.98]"
            >
              <PlusCircle className="h-4.5 w-4.5" />
              <span>Go to Tasks</span>
            </ReactRouterLink>
          </div>

          {loading && !summary ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 bg-dark-900/60 border border-dark-800 rounded-2xl" />
              ))}
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Tasks"
                  value={summary?.total_tasks || 0}
                  icon={ClipboardList}
                  colorClass="text-indigo-400"
                  glowClass="bg-indigo-500/10"
                />
                <StatCard
                  title="Pending"
                  value={summary?.pending_tasks || 0}
                  icon={Hourglass}
                  colorClass="text-yellow-400"
                  glowClass="bg-yellow-500/10"
                />
                <StatCard
                  title="In Progress"
                  value={summary?.in_progress_tasks || 0}
                  icon={Activity}
                  colorClass="text-blue-400"
                  glowClass="bg-blue-500/10"
                />
                <StatCard
                  title="Completed"
                  value={summary?.completed_tasks || 0}
                  icon={CheckCircle}
                  colorClass="text-green-400"
                  glowClass="bg-green-500/10"
                />
              </div>

              {/* Stats Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Tasks Created By Me"
                  value={summary?.tasks_created_by_me || 0}
                  icon={PlusCircle}
                  colorClass="text-brand-400"
                  glowClass="bg-brand-500/10"
                />
                <StatCard
                  title="Tasks Assigned To Me"
                  value={summary?.tasks_assigned_to_me || 0}
                  icon={User}
                  colorClass="text-pink-400"
                  glowClass="bg-pink-500/10"
                />
                <StatCard
                  title="Total Team Users"
                  value={summary?.total_users || 0}
                  icon={Users}
                  colorClass="text-cyan-400"
                  glowClass="bg-cyan-500/10"
                />
              </div>

              {/* Lower Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* My Tasks List */}
                <div className="lg:col-span-2 glass-panel rounded-2xl border border-dark-850 p-6 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-dark-800/80">
                    <div className="flex items-center space-x-2.5">
                      <ClipboardCheck className="h-5.5 w-5.5 text-brand-400" />
                      <h3 className="text-lg font-bold text-white tracking-wide">
                        Assigned to Me
                      </h3>
                    </div>
                    <ReactRouterLink
                      to="/tasks"
                      className="text-xs text-brand-400 hover:text-brand-350 font-semibold flex items-center space-x-1 hover:underline"
                    >
                      <span>View all</span>
                      <ArrowRight className="h-3 w-3" />
                    </ReactRouterLink>
                  </div>

                  {myTasks.length === 0 ? (
                    <div className="text-center py-10 space-y-3 bg-dark-900/20 rounded-xl border border-dashed border-dark-800">
                      <p className="text-sm text-dark-400 font-normal">
                        No tasks assigned to you yet!
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-xs font-semibold text-dark-450 border-b border-dark-800/60">
                            <th className="pb-3 font-semibold">Title</th>
                            <th className="pb-3 font-semibold">Priority</th>
                            <th className="pb-3 font-semibold">Status</th>
                            <th className="pb-3 font-semibold">Due Date</th>
                            <th className="pb-3 font-semibold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-850 text-sm">
                          {myTasks.slice(0, 5).map((t) => (
                            <tr key={t.id} className="hover:bg-dark-800/20 transition-colors">
                              <td className="py-4 font-bold text-white max-w-[200px] truncate">
                                {t.title}
                              </td>
                              <td className="py-4 font-normal">
                                <span className="capitalize">{t.priority}</span>
                              </td>
                              <td className="py-4">
                                <TaskStatusBadge status={t.status} />
                              </td>
                              <td className="py-4 text-dark-400">
                                {formatDueDate(t.due_date)}
                              </td>
                              <td className="py-4 text-right">
                                <ReactRouterLink
                                  to={`/tasks/${t.id}`}
                                  className="text-xs font-semibold text-brand-400 hover:text-brand-350 hover:underline"
                                >
                                  Manage
                                </ReactRouterLink>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Info Panel / Fast Actions */}
                <div className="glass-panel rounded-2xl border border-dark-850 p-6 space-y-6">
                  <h3 className="text-lg font-bold text-white tracking-wide pb-4 border-b border-dark-800/80">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <ReactRouterLink
                      to="/tasks"
                      className="flex flex-col items-start p-4 bg-dark-850/40 hover:bg-dark-800 border border-dark-750/80 hover:border-brand-500/30 rounded-xl transition-all duration-200 group"
                    >
                      <span className="text-sm font-bold text-white group-hover:text-brand-300">
                        Create New Task
                      </span>
                      <span className="text-xs text-dark-400 mt-1 font-normal">
                        Create a task, set priorities, and assign it.
                      </span>
                    </ReactRouterLink>

                    <ReactRouterLink
                      to="/profile"
                      className="flex flex-col items-start p-4 bg-dark-850/40 hover:bg-dark-800 border border-dark-750/80 hover:border-brand-500/30 rounded-xl transition-all duration-200 group"
                    >
                      <span className="text-sm font-bold text-white group-hover:text-brand-300">
                        Edit Profile
                      </span>
                      <span className="text-xs text-dark-400 mt-1 font-normal">
                        Update your details and contact information.
                      </span>
                    </ReactRouterLink>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default SummaryView;
