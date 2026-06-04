import { format, parseISO } from "date-fns";

export const formatDueDate = (dateString?: string | null): string => {
  if (!dateString) return "No due date";
  try {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy");
  } catch (err) {
    return "Invalid date";
  }
};

export const formatFullDateTime = (dateString?: string | null): string => {
  if (!dateString) return "N/A";
  try {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  } catch (err) {
    return "N/A";
  }
};
