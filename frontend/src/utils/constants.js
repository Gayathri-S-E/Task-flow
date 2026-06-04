export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const STATUS_COLORS = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export const PRIORITY_COLORS = {
  low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  medium: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
};
