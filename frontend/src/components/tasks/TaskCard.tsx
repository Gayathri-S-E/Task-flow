import React from "react";
import { Link } from "react-router-dom";
import TaskStatusBadge from "./TaskStatusBadge";
import { formatDueDate } from "../../utils/formatDate";
import { PRIORITY_COLORS, PRIORITY_OPTIONS } from "../../utils/constants";
import { Calendar, User, Eye, AlertTriangle } from "lucide-react";
import { Task } from "../../types/task/task_types";

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const priorityColor = (PRIORITY_COLORS as any)[task.priority] || "bg-dark-800 text-dark-300";
  const priorityLabel = PRIORITY_OPTIONS.find((o) => o.value === task.priority)?.label || task.priority;

  return (
    <div className="glass-card rounded-2xl p-5 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 flex flex-col justify-between h-52 group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <TaskStatusBadge status={task.status} />
          
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${priorityColor}`}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            {priorityLabel}
          </span>
        </div>

        <h4 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
          {task.title}
        </h4>
        
        <p className="text-xs text-dark-400 mt-1.5 line-clamp-2 font-normal leading-relaxed">
          {task.description || "No description provided."}
        </p>
      </div>

      <div className="border-t border-dark-800/80 pt-3 flex items-center justify-between text-xs text-dark-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5" title="Due Date">
            <Calendar className="h-3.5 w-3.5 text-dark-500" />
            <span>{formatDueDate(task.due_date)}</span>
          </div>

          <div className="flex items-center space-x-1.5" title="Assignee">
            <User className="h-3.5 w-3.5 text-dark-500" />
            <span className="truncate max-w-[100px]">
              {task.assignee ? (task.assignee.full_name || task.assignee.username) : "Unassigned"}
            </span>
          </div>
        </div>

        <Link
          to={`/tasks/${task.id}`}
          className="p-1.5 rounded-lg bg-dark-900/60 hover:bg-brand-600 border border-dark-750 hover:border-brand-500 text-dark-300 hover:text-white transition-all duration-200"
          title="View Details"
        >
          <Eye className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;
