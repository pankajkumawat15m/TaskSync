import { useState, useEffect, useRef } from "react";
import {
  X,
  Trash2,
  Calendar,
  User,
  AlertTriangle,
  Clock,
  ListChecks,
  MessageSquare,
  History,
  Play,
  CheckCircle,
  Plus
} from "lucide-react";
import { Button } from "./ui/Button";

const TaskDrawer = ({
  isOpen,
  onClose,
  task,
  members,
  columns,
  onUpdateTask,
  onDeleteTask,
  activeUser
}) => {
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [column, setColumn] = useState("");
  const [deadline, setDeadline] = useState("");
  const [username, setUsername] = useState("");
  const [timeSpent, setTimeSpent] = useState("0h");
  const [timeEstimate, setTimeEstimate] = useState("4h");

  // Subtask list state
  const [newSubtask, setNewSubtask] = useState("");

  // Comment state
  const [newComment, setNewComment] = useState("");

  const drawerRef = useRef(null);

  // Sync state when task changes
  useEffect(() => {
    if (task) {
      setContent(task.content || "");
      setDescription(task.description || "");
      setPriority(task.priority || "medium");
      setColumn(task.column || "");
      setDeadline(task.deadline || "");
      setUsername(task.username || "");
      setTimeSpent(task.timeSpent || "0h");
      setTimeEstimate(task.timeEstimate || "4h");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleFieldChange = (field, value) => {
    const updated = { ...task, [field]: value };
    onUpdateTask(updated);
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;

    const subtasks = [...(task.subtasks || [])];
    const newSub = {
      id: "sub-" + Date.now(),
      content: newSubtask,
      completed: false
    };
    subtasks.push(newSub);

    const updatedTask = {
      ...task,
      subtasks,
      activities: [
        {
          id: "act-sub-" + Date.now(),
          username: activeUser,
          text: `added checklist item "${newSubtask}"`,
          date: new Date().toISOString()
        },
        ...(task.activities || [])
      ]
    };
    onUpdateTask(updatedTask);
    setNewSubtask("");
  };

  const handleToggleSubtask = (subId) => {
    const subtasks = task.subtasks.map((s) => {
      if (s.id === subId) {
        return { ...s, completed: !s.completed };
      }
      return s;
    });

    const sub = task.subtasks.find((s) => s.id === subId);
    const actionText = sub.completed ? "uncompleted checklist item" : "completed checklist item";

    const updatedTask = {
      ...task,
      subtasks,
      activities: [
        {
          id: "act-sub-toggle-" + Date.now(),
          username: activeUser,
          text: `${actionText} "${sub.content}"`,
          date: new Date().toISOString()
        },
        ...(task.activities || [])
      ]
    };
    onUpdateTask(updatedTask);
  };

  const handleDeleteSubtask = (subId) => {
    const sub = task.subtasks.find((s) => s.id === subId);
    const subtasks = task.subtasks.filter((s) => s.id !== subId);

    const updatedTask = {
      ...task,
      subtasks,
      activities: [
        {
          id: "act-sub-del-" + Date.now(),
          username: activeUser,
          text: `deleted checklist item "${sub.content}"`,
          date: new Date().toISOString()
        },
        ...(task.activities || [])
      ]
    };
    onUpdateTask(updatedTask);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comments = [...(task.comments || [])];
    const comment = {
      id: "comm-" + Date.now(),
      username: activeUser,
      text: newComment,
      date: new Date().toISOString()
    };
    comments.unshift(comment); // Newest comments first

    const updatedTask = {
      ...task,
      comments,
      activities: [
        {
          id: "act-comm-" + Date.now(),
          username: activeUser,
          text: `added a comment: "${newComment.substring(0, 30)}${newComment.length > 30 ? "..." : ""}"`,
          date: new Date().toISOString()
        },
        ...(task.activities || [])
      ]
    };
    onUpdateTask(updatedTask);
    setNewComment("");
  };

  const handleDeleteComment = (commId) => {
    const comments = task.comments.filter((c) => c.id !== commId);
    const updatedTask = {
      ...task,
      comments
    };
    onUpdateTask(updatedTask);
  };

  const subtaskStats = (() => {
    if (!task.subtasks || task.subtasks.length === 0) return null;
    const completed = task.subtasks.filter((s) => s.completed).length;
    const total = task.subtasks.length;
    const percent = Math.round((completed / total) * 100);
    return { completed, total, percent };
  })();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-lg sm:max-w-xl bg-white dark:bg-gray-950 border-l border-slate-200 dark:border-gray-800 text-gray-900 dark:text-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-800/80 flex items-center justify-between bg-slate-50 dark:bg-gray-950/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-2 py-0.5 rounded">
              {task.id}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this task?")) {
                  onDeleteTask(task.id);
                }
              }}
              className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition"
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white p-1.5 rounded hover:bg-slate-200 dark:hover:bg-gray-800 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Drawer Body - Scrollable content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {/* Editable Title */}
          <div className="space-y-1">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={() => handleFieldChange("content", content)}
              className="w-full bg-transparent border-none text-xl font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500/30 px-1.5 py-1 rounded"
              placeholder="Task Title"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-gray-900/40 p-4 border border-slate-200 dark:border-gray-800 rounded-xl text-xs select-none">
            {/* Status column */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                🟢 Status
              </span>
              <select
                value={column}
                onChange={(e) => {
                  setColumn(e.target.value);
                  handleFieldChange("column", e.target.value);
                }}
                className="w-full bg-white dark:bg-gray-950 border border-slate-250 dark:border-gray-800 rounded px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer font-medium text-gray-700 dark:text-gray-300"
              >
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col.replace(/([A-Z])/g, " $1")}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <User size={12} /> Assignee
              </span>
              <select
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  handleFieldChange("username", e.target.value);
                }}
                className="w-full bg-white dark:bg-gray-950 border border-slate-250 dark:border-gray-800 rounded px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer font-medium text-gray-700 dark:text-gray-300"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle size={12} /> Priority
              </span>
              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  handleFieldChange("priority", e.target.value);
                }}
                className="w-full bg-white dark:bg-gray-950 border border-slate-250 dark:border-gray-800 rounded px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer font-medium text-gray-700 dark:text-gray-300"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            {/* Deadline */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar size={12} /> Due Date
              </span>
              <input
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  handleFieldChange("deadline", e.target.value);
                }}
                className="w-full bg-white dark:bg-gray-950 border border-slate-250 dark:border-gray-800 rounded px-2 py-0.5 focus:outline-none focus:border-blue-500 text-gray-700 dark:text-gray-300 text-[11px] font-semibold"
              />
            </div>

            {/* Time Tracking Estimation */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Clock size={12} /> Estimate
              </span>
              <input
                type="text"
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
                onBlur={() => handleFieldChange("timeEstimate", timeEstimate)}
                className="w-full bg-white dark:bg-gray-950 border border-slate-250 dark:border-gray-800 rounded px-2 py-1 focus:outline-none focus:border-blue-500 font-medium text-gray-700 dark:text-gray-300"
                placeholder="e.g. 8h"
              />
            </div>

            {/* Time Spent */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Play size={11} /> Logged Time
              </span>
              <input
                type="text"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                onBlur={() => handleFieldChange("timeSpent", timeSpent)}
                className="w-full bg-white dark:bg-gray-950 border border-slate-250 dark:border-gray-800 rounded px-2 py-1 focus:outline-none focus:border-blue-500 font-medium text-gray-700 dark:text-gray-300"
                placeholder="e.g. 2h 30m"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleFieldChange("description", description)}
              rows={4}
              placeholder="Enter detailed description..."
              className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-600 leading-relaxed text-gray-800 dark:text-gray-300 resize-y"
            />
          </div>

          {/* Checklist items */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <ListChecks size={14} className="text-blue-500" />
              <span>Checklist</span>
            </label>

            {/* Checklist progress */}
            {subtaskStats && (
              <div className="space-y-1.5 select-none">
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-semibold">
                  <span>{subtaskStats.percent}% complete</span>
                  <span>{subtaskStats.completed}/{subtaskStats.total} items</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-gray-900 rounded-full h-1 border border-slate-200/50 dark:border-gray-800 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${subtaskStats.percent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Subtasks List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {task.subtasks && task.subtasks.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-gray-900/60 border border-slate-200/80 dark:border-gray-800 rounded-xl text-xs transition"
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleToggleSubtask(s.id)}
                      className={`text-gray-400 dark:text-gray-500 rounded-full hover:scale-115 transition ${
                        s.completed ? "text-emerald-500 dark:text-emerald-400" : "hover:text-emerald-500"
                      }`}
                    >
                      <CheckCircle size={16} fill={s.completed ? "currentColor" : "none"} className={s.completed ? "text-white dark:text-gray-950" : ""} />
                    </button>
                    <span className={`text-gray-700 dark:text-gray-300 font-medium ${s.completed ? "line-through text-gray-400 dark:text-gray-500" : ""}`}>
                      {s.content}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSubtask(s.id)}
                    className="text-gray-400 dark:text-gray-600 hover:text-red-500 p-0.5 rounded transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Add subtask */}
            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add checklist item..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 flex-grow text-gray-800 dark:text-white"
              />
              <button
                type="submit"
                className="bg-slate-50 dark:bg-gray-900 hover:bg-slate-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400 hover:text-blue-700 border border-slate-200 dark:border-gray-800 rounded-xl px-3 flex items-center justify-center text-xs font-bold transition"
              >
                Add
              </button>
            </form>
          </div>

          {/* Comments Widget */}
          <div className="space-y-4 pt-2">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={14} className="text-purple-600 dark:text-purple-400" />
              <span>Comments ({task.comments?.length || 0})</span>
            </label>

            {/* Add Comment */}
            <form onSubmit={handleAddComment} className="space-y-2">
              <textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-500 placeholder-gray-400 dark:placeholder-gray-600 leading-normal text-gray-800 dark:text-gray-300 resize-none"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full text-[11px] font-bold px-4 py-1.5 h-auto disabled:opacity-50"
                >
                  Send Comment
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3.5 pt-2">
              {task.comments && task.comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-gray-900/40 border border-slate-200/80 dark:border-gray-800 rounded-xl text-xs">
                  <div className="text-[16px] bg-white dark:bg-gray-950 p-1.5 rounded-lg border border-slate-200 dark:border-gray-800 leading-none">
                    👤
                  </div>
                  <div className="flex-grow space-y-1">
                    <div className="flex justify-between items-center select-none">
                      <span className="font-extrabold text-gray-700 dark:text-gray-300">{c.username}</span>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500">
                        <span>{new Date(c.date).toLocaleDateString()}</span>
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="hover:text-red-500"
                          title="Delete Comment"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2 select-none">
              <History size={14} className="text-cyan-600 dark:text-cyan-400" />
              <span>Activity History</span>
            </label>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {task.activities && task.activities.map((act) => (
                <div key={act.id} className="flex gap-2 text-[11px] leading-snug">
                  <span className="text-cyan-500 font-bold select-none">•</span>
                  <div className="text-gray-500 dark:text-gray-400 font-medium">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{act.username}</span>{" "}
                    <span>{act.text}</span>{" "}
                    <span className="text-[9px] text-gray-400 dark:text-gray-600 ml-1">
                      {new Date(act.date).toLocaleDateString()} at{" "}
                      {new Date(act.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDrawer;
