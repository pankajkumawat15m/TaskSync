import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "./ui/Dialog";
import { Button } from "./ui/Button";

const DeleteProjectDialog = ({ isOpen, onClose, projectName, onDelete }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 backdrop-blur-xl text-gray-900 dark:text-white rounded-2xl p-6 max-w-[90vw] sm:max-w-md overflow-hidden shadow-2xl select-none animate-in fade-in zoom-in-95 duration-200 text-xs">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-slate-100 dark:border-gray-900">
          <DialogTitle className="text-lg font-extrabold flex items-center gap-2 text-red-600 dark:text-red-400">
            <span className="p-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertTriangle size={16} />
            </span>
            <span>Confirm Delete Project</span>
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <p className="py-4 text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
          Are you sure you want to delete the active project <strong>"{projectName}"</strong>?
          <br /><br />
          <span className="text-red-500 font-semibold">⚠️ WARNING:</span> This will permanently delete all tasks, Kanban columns, checklist subtasks, comments, and activity audit logs associated with this project. This action cannot be undone.
        </p>

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
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold px-5 shadow-lg shadow-red-900/30"
          >
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProjectDialog;
