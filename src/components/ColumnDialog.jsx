import { useState, useEffect } from "react";
import { X, Layers, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "./ui/Dialog";
import { Button } from "./ui/Button";

const ColumnDialog = ({ isOpen, onClose, onAddColumn }) => {
  const [newColumnName, setNewColumnName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNewColumnName("");
    }
  }, [isOpen]);

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    onAddColumn(newColumnName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 backdrop-blur-xl text-gray-900 dark:text-white rounded-2xl p-6 max-w-[90vw] sm:max-w-md overflow-hidden shadow-2xl select-none animate-in fade-in zoom-in-95 duration-200 text-xs">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-slate-100 dark:border-gray-900 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-extrabold flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <Plus size={16} />
            </span>
            <span>Create New Column</span>
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-4 pt-4 text-xs">
          <div className="space-y-1.5">
            <label htmlFor="column-name" className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={12} className="text-blue-600 dark:text-blue-400" />
              <span>Column Name</span>
            </label>
            <input
              id="column-name"
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="e.g. In Review, QA Testing"
              className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 rounded-xl px-3 py-2.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none transition"
              autoFocus
            />
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
            onClick={handleAddColumn}
            disabled={!newColumnName.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-5 shadow-lg shadow-blue-900/30 disabled:opacity-50"
          >
            Add Column
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnDialog;