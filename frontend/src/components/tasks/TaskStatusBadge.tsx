import React from "react";
import { STATUS_COLORS, STATUS_OPTIONS } from "../../utils/constants";

interface TaskStatusBadgeProps {
  status: string;
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const colorClass = (STATUS_COLORS as any)[status] || "bg-dark-850 text-dark-300";
  const label = STATUS_OPTIONS.find((o) => o.value === status)?.label || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse-subtle" />
      {label}
    </span>
  );
};

export default TaskStatusBadge;
