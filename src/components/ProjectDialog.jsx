import { useState, useEffect } from "react";
import { X, Layout, Plus, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "./ui/Dialog";
import { Button } from "./ui/Button";

const ProjectDialog = ({ isOpen, onClose, onAddProject }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("blue");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setColor("blue");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!name.trim()) return;
    onAddProject(name, description, color);
    onClose();
  };

  if (!isOpen) return null;

  const colorOptions = [
    { id: "blue", class: "bg-blue-500 hover:bg-blue-600" },
    { id: "purple", class: "bg-purple-500 hover:bg-purple-600" },
    { id: "emerald", class: "bg-emerald-500 hover:bg-emerald-600" },
    { id: "rose", class: "bg-rose-500 hover:bg-rose-600" },
    { id: "amber", class: "bg-amber-500 hover:bg-amber-600" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 backdrop-blur-xl text-gray-900 dark:text-white rounded-2xl p-6 max-w-[90vw] sm:max-w-md overflow-hidden shadow-2xl select-none animate-in fade-in zoom-in-95 duration-200 text-xs">
        <DialogHeader className="pb-4 border-b border-slate-100 dark:border-gray-900 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-extrabold flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <Plus size={16} />
            </span>
            <span>Create New Project</span>
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <label htmlFor="project-name" className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layout size={12} className="text-blue-600 dark:text-blue-400" />
              <span>Project Name</span>
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mobile Application Dev"
              className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 rounded-xl px-3 py-2.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none transition"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="project-desc" className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={12} className="text-purple-600 dark:text-purple-400" />
              <span>Description</span>
            </label>
            <textarea
              id="project-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the workspace objective..."
              rows={2}
              className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 rounded-xl p-3 text-xs text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none resize-none transition"
            />
          </div>

          {/* Color coding selector */}
          <div className="space-y-2">
            <label className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎨 Accent Visual Theme</span>
            </label>
            <div className="flex gap-3">
              {colorOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setColor(opt.id)}
                  className={`w-6 h-6 rounded-full transition-transform hover:scale-115 ${opt.class} ${
                    color === opt.id ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-950" : ""
                  }`}
                  title={`${opt.id} Theme`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="pt-5 mt-4 border-t border-slate-100 dark:border-gray-900 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-200 dark:border-gray-800 hover:bg-slate-100 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl text-xs font-bold px-4"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-5 shadow-lg shadow-blue-900/30 disabled:opacity-50"
          >
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
