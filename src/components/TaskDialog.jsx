import { useState, useEffect } from "react";
import {
  X,
  FileText,
  AlertTriangle,
  User,
  Calendar,
  Layers,
  Plus,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "./ui/Dialog";
import { Button } from "./ui/Button";

const TaskDialog = ({
  isOpen,
  onClose,
  columns,
  onAddTask,
  selectedColumn,
  defaultDeadline,
  members
}) => {
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [column, setColumn] = useState("todo");
  const [deadline, setDeadline] = useState("");
  const [username, setUsername] = useState("Aarav");
  const [timeEstimate, setTimeEstimate] = useState("4h");

  // Sync defaults when modal opens or column changes
  useEffect(() => {
    if (isOpen) {
      setContent("");
      setDescription("");
      setPriority("medium");
      setColumn(selectedColumn || (columns && columns[0]) || "todo");
      setDeadline(defaultDeadline || "");
      setUsername((members && members.length > 0) ? members[0].name : "Aarav");
      setTimeEstimate("4h");
    }
  }, [isOpen, selectedColumn, defaultDeadline, columns, members]);

  const handleSave = () => {
    if (!content.trim()) return;
    onAddTask({
      content,
      description,
      priority,
      column,
      deadline,
      username,
      timeEstimate,
      date: new Date().toISOString().split("T")[0]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 backdrop-blur-xl text-gray-900 dark:text-white rounded-2xl p-6 max-w-[90vw] sm:max-w-xl overflow-hidden shadow-2xl select-none animate-in fade-in zoom-in-95 duration-200 text-xs">
        <DialogHeader className="pb-4 border-b border-slate-100 dark:border-gray-900 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-extrabold flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <Plus size={16} />
            </span>
            <span>Create New Task</span>
          </DialogTitle>
        </DialogHeader>

        {/* Form Body */}
        <div className="space-y-4 pt-4 max-h-[65vh] overflow-y-auto pr-1 scrollbar-thin text-xs">
          {/* Content (Title) */}
          <div className="space-y-1.5">
            <label className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={12} className="text-blue-600 dark:text-blue-400" />
              <span>Task Title</span>
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. Implement Oauth authentication"
              className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 rounded-xl px-3 py-2.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none transition"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={12} className="text-purple-600 dark:text-purple-400" />
              <span>Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed objective description..."
              rows={3}
              className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 rounded-xl p-3 text-xs text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none resize-none transition"
            />
          </div>

          {/* Grid properties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status (Column) */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={12} className="text-cyan-600 dark:text-cyan-400" />
                <span>Column State</span>
              </label>
              <select
                value={column}
                onChange={(e) => setColumn(e.target.value)}
                className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-blue-500 rounded-xl px-3 py-2 focus:outline-none cursor-pointer font-medium text-gray-700 dark:text-gray-300 transition"
              >
                {columns && columns.map((col) => (
                  <option key={col} value={col} className="bg-white dark:bg-gray-950 text-gray-800 dark:text-white">
                    {col.replace(/([A-Z])/g, " $1")}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <User size={12} className="text-amber-600 dark:text-amber-400" />
                <span>Assignee</span>
              </label>
              <select
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-blue-500 rounded-xl px-3 py-2 focus:outline-none cursor-pointer font-medium text-gray-700 dark:text-gray-300 transition"
              >
                {members && members.map((m) => (
                  <option key={m.id} value={m.name} className="bg-white dark:bg-gray-950 text-gray-800 dark:text-white">
                    {m.avatar} {m.name} ({m.role})
                  </option>
                ))}
                {(!members || members.length === 0) && (
                  <option value="Aarav" className="bg-white dark:bg-gray-950 text-gray-800 dark:text-white">
                    Aarav
                  </option>
                )}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={12} className="text-red-500 dark:text-red-400" />
                <span>Severity Level</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-blue-500 rounded-xl px-3 py-2 focus:outline-none cursor-pointer font-medium text-gray-700 dark:text-gray-300 transition"
              >
                <option value="high" className="bg-white dark:bg-gray-950 text-gray-800 dark:text-white">🔴 High</option>
                <option value="medium" className="bg-white dark:bg-gray-950 text-gray-800 dark:text-white">🟡 Medium</option>
                <option value="low" className="bg-white dark:bg-gray-950 text-gray-800 dark:text-white">🟢 Low</option>
              </select>
            </div>

            {/* Time Estimate */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={12} className="text-emerald-600 dark:text-emerald-400" />
                <span>Time Estimate</span>
              </label>
              <input
                type="text"
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
                placeholder="e.g. 8h"
                className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-blue-500 rounded-xl px-3 py-2 focus:outline-none font-medium text-gray-700 dark:text-gray-300 transition"
              />
            </div>

            {/* Deadline */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={12} className="text-blue-600 dark:text-blue-400" />
                <span>Target Due Date</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-blue-500 rounded-xl px-3 py-1.5 focus:outline-none font-bold text-gray-700 dark:text-gray-300 transition text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="pt-5 mt-4 border-t border-slate-100 dark:border-gray-900 flex justify-end gap-3 select-none">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-200 dark:border-gray-800 hover:bg-slate-100 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl text-xs font-bold px-4"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!content.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-5 shadow-lg shadow-blue-900/30 disabled:opacity-50"
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;