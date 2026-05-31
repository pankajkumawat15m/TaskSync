import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  User,
  CheckSquare,
  MessageSquare,
  MoreVertical,
  Trash2,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Task = React.memo(({ task, onClick, onDelete, onUpdateTask, isDragOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    }
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  // Time remaining calculation
  const getTimeRemainingInfo = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const dueDate = new Date(deadline);
    if (isNaN(dueDate.getTime())) return null;

    const diff = dueDate.getTime() - now.getTime();
    const days = Math.ceil(diff / 86400000);

    if (days < 0) return { text: "Overdue", isExpired: true };
    if (days === 0) return { text: "Today", isExpiringToday: true };
    if (days === 1) return { text: "Tomorrow", isNear: true };
    return { text: `${days}d left`, isSafe: true };
  };

  const deadlineInfo = getTimeRemainingInfo(task.deadline);

  // Subtask statistics
  const subtaskStats = React.useMemo(() => {
    if (!task.subtasks || task.subtasks.length === 0) return null;
    const completed = task.subtasks.filter((s) => s.completed).length;
    const total = task.subtasks.length;
    const percent = Math.round((completed / total) * 100);
    return { completed, total, percent };
  }, [task.subtasks]);

  const priorityMeta = {
    high: { border: "border-l-red-500", bg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20", glow: "hover:shadow-red-500/5 dark:hover:shadow-red-500/5" },
    medium: { border: "border-l-amber-500", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20", glow: "hover:shadow-amber-500/5 dark:hover:shadow-amber-500/5" },
    low: { border: "border-l-emerald-500", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", glow: "hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/5" }
  }[task.priority || "medium"];

  const handleTaskClick = () => {
    if (!isDragOverlay && onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleTaskClick}
      className={`group p-4 bg-white dark:bg-gray-900 border border-slate-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700/80 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing border-l-4 ${
        priorityMeta.border
      } ${priorityMeta.glow} ${
        isDragOverlay ? "ring-2 ring-blue-500/80 border-l-4" : ""
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        {/* Title */}
        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-black dark:group-hover:text-white transition">
          {task.content}
        </h4>

        {/* Dropdown Options */}
        {!isDragOverlay && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded transition duration-200"
              >
                <MoreVertical size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 shadow-xl rounded-lg text-gray-700 dark:text-gray-300">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.stopPropagation();
                  handleTaskClick();
                }}
                className="hover:bg-slate-100 dark:hover:bg-gray-900 cursor-pointer text-xs"
              >
                ✏️ View & Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer text-xs"
              >
                🗑 Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Subtasks Progress Bar */}
      {subtaskStats && (
        <div className="mt-3.5 space-y-1">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 dark:text-gray-500">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded((prev) => !prev);
              }}
              className="flex items-center gap-1 hover:text-blue-500 transition select-none"
            >
              <CheckSquare size={10} />
              <span>
                {subtaskStats.completed}/{subtaskStats.total} Checklist
              </span>
              <span className="text-[8px] opacity-75 font-semibold text-blue-500">
                {isExpanded ? "▲ Hide" : "▼ Show"}
              </span>
            </button>
            <span>{subtaskStats.percent}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-gray-950 rounded-full h-1 border border-slate-200/50 dark:border-gray-800 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${subtaskStats.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Interactive Subtask list */}
      {isExpanded && task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-3.5 space-y-1 max-h-28 overflow-y-auto pr-1 border-t border-slate-100 dark:border-gray-900 pt-2 select-none scrollbar-none">
          {task.subtasks.map((sub) => (
            <label
              key={sub.id}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 p-1 hover:bg-slate-50 dark:hover:bg-gray-900/60 rounded transition cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={sub.completed}
                onChange={(e) => {
                  e.stopPropagation();
                  const updatedSubtasks = task.subtasks.map((s) =>
                    s.id === sub.id ? { ...s, completed: !s.completed } : s
                  );
                  onUpdateTask({ ...task, subtasks: updatedSubtasks });
                }}
                className="rounded text-blue-500 bg-slate-50 border-slate-200 dark:bg-gray-900 dark:border-gray-800 focus:ring-0 w-3 h-3"
              />
              <span className={`text-[10px] text-gray-700 dark:text-gray-300 font-semibold ${sub.completed ? "line-through text-gray-400 dark:text-gray-500" : ""}`}>
                {sub.content}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* Meta Footer Row */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-900 flex justify-between items-center flex-wrap gap-2 text-[10px]">
        {/* Left indicators (Priority, Comments, Deadlines) */}
        <div className="flex items-center gap-2">
          {/* Priority Pill */}
          <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${priorityMeta.bg}`}>
            {task.priority}
          </span>

          {/* Comments Count */}
          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500 font-semibold" title="Comments">
              <MessageSquare size={11} className="text-gray-400" />
              <span>{task.comments.length}</span>
            </span>
          )}

          {/* Deadline Alert Badge */}
          {deadlineInfo && (
            <span
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded font-bold ${
                deadlineInfo.isExpired
                  ? "bg-red-500/10 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/20"
                  : deadlineInfo.isExpiringToday
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/20 animate-pulse"
                  : "text-gray-400 dark:text-gray-500"
              }`}
              title={`Deadline: ${new Date(task.deadline).toLocaleDateString()}`}
            >
              <Clock size={10} />
              <span>{deadlineInfo.text}</span>
            </span>
          )}
        </div>

        {/* Right assignee capsule */}
        <div
          className="flex items-center gap-1 bg-slate-50 dark:bg-gray-950 border border-slate-100 dark:border-gray-800 py-0.5 pl-1.5 pr-2.5 rounded-full"
          title={`Assigned to: ${task.username}`}
        >
          <span className="text-[11px]">👤</span>
          <span className="font-bold text-gray-600 dark:text-gray-400 max-w-[54px] truncate">{task.username}</span>
        </div>
      </div>
    </div>
  );
});

export default Task;