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
      className={`group p-3 mb-3 rounded-lg border-l-4 shadow-card hover:shadow-card-hover transition-shadow duration-200 bg-gray-50 ${
        {
          high: "border-l-task-border-high",
          medium: "border-l-task-border-medium",
          low: "border-l-task-border-low",
        }[task.priority || "medium"]
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-foreground line-clamp-2">
            {task.content}
          </p>
          <span className="inline-block mt-1 px-2 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
            {task.priority.toUpperCase()}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground hover:bg-accent/50"
            >
              ⋮
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-50 border-input">
            <DropdownMenuItem
              onSelect={() => onEdit(task)}
              className="text-foreground hover:bg-accent/50"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleDeleteClick}
              className="text-destructive hover:bg-destructive/10"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-sm mt-2 space-y-1">
        <p className="text-muted-foreground">
          Created: {new Date(task.date).toLocaleDateString()}
        </p>
        {task.deadline && (
          <p
            className={
              isOverdue ? "text-red-500 font-semibold" : "text-muted-foreground"
            }
          >
            Deadline: {timeRemaining}
          </p>
        )}
        <p className="text-muted-foreground">
          Assigned to: {task.username || "Unassigned"}
        </p>
      </div>
    </div>
  );
});

export default Task;