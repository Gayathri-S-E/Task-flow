import React, { useState, useEffect } from "react";
import { useTasks } from "../../api/task/hooks/useTasks";
import { useGetUsers } from "../../api/user/hooks/useGetUsers";
import useAuthStore from "../../store/authStore";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../../utils/constants";
import { Filter, RotateCcw } from "lucide-react";

export const TaskFilters: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useTasks();
  const { user } = useAuthStore();
  const { users, fetchUsers } = useGetUsers();

  const isManager = user?.role === "manager";

  useEffect(() => {
    if (isManager) {
      fetchUsers();
    }
  }, [isManager]);

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900/40">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2 text-dark-300 font-medium text-sm pr-2">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => updateFilters({ status: e.target.value })}
          className="glass-input py-1.5 px-3 text-xs w-40 cursor-pointer"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => updateFilters({ priority: e.target.value })}
          className="glass-input py-1.5 px-3 text-xs w-40 cursor-pointer"
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Assignee Filter (Manager Only) */}
        {isManager && (
          <select
            value={filters.assignee_id}
            onChange={(e) => updateFilters({ assignee_id: e.target.value })}
            className="glass-input py-1.5 px-3 text-xs w-48 cursor-pointer"
          >
            <option value="">All Assignees</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.username}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        onClick={resetFilters}
        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-dark-300 hover:text-white bg-dark-800 hover:bg-dark-750 border border-dark-700/60 transition-colors"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
};

export default TaskFilters;
