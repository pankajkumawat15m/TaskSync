import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

const Task = React.memo(({ task, columnId, onEdit, onDelete }) => {
  const getTimeRemaining = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const dueDate = new Date(deadline);
    if (isNaN(dueDate.getTime())) return "Invalid date";

    const diff = dueDate.getTime() - now.getTime();
    if (diff < 0) return "Overdue";

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days >= 1) return `${days} day${days > 1 ? "s" : ""} left`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    return `${minutes} minute${minutes !== 1 ? "s" : ""} left`;
  };

  const timeRemaining = getTimeRemaining(task.deadline);
  const isOverdue = timeRemaining === "Overdue";

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(columnId, task.id);
  };

  return (
    <div
      className={`group p-3 sm:p-4 mb-3 sm:mb-4 rounded-xl shadow-md transition-shadow duration-200 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border-l-4 ${
        {
          high: "border-red-500",
          medium: "border-yellow-500",
          low: "border-green-500",
        }[task.priority || "medium"]
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="w-full">
          <p className="font-semibold text-sm sm:text-base line-clamp-2">{task.content}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs sm:text-sm font-medium rounded-full">
            {task.priority.toUpperCase()}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ⋮
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-300 dark:border-gray-600">
            <DropdownMenuItem
              onSelect={() => onEdit(task)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm sm:text-base"
            >
              ✏️ Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleDeleteClick}
              className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer text-sm sm:text-base"
            >
              🗑 Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-xs sm:text-sm mt-2 sm:mt-3 space-y-1">
        <p className="text-gray-600 dark:text-gray-400">
          Created: {new Date(task.date).toLocaleDateString()}
        </p>
        {task.deadline && (
          <p
            className={
              isOverdue
                ? "text-red-600 font-semibold"
                : "text-gray-600 dark:text-gray-400"
            }
          >
            Deadline: {timeRemaining}
          </p>
        )}
        <p className="text-gray-600 dark:text-gray-400">
          Assigned to: {task.username || "Unassigned"}
        </p>
      </div>
    </div>
  );
});

export default Task;