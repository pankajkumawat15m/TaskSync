import { Keyboard, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "./ui/Dialog";
import { Button } from "./ui/Button";

const KeyboardShortcutsDialog = ({ isOpen, onClose }) => {
  const shortcuts = [
    { keys: ["K"], desc: "Switch to Kanban Board view" },
    { keys: ["D"], desc: "Switch to executive Dashboard metrics" },
    { keys: ["L"], desc: "Switch to dense List Spreadsheet view" },
    { keys: ["C"], desc: "Switch to Deadline Calendar view" },
    { keys: ["T"], desc: "Switch to Sprint Roadmap Timeline view" },
    { keys: ["N"], desc: "Open Create Task modal" },
    { keys: ["P"], desc: "Open Create Project modal" },
    { keys: ["M"], desc: "Open Add Team Member modal" },
    { keys: ["O"], desc: "Toggle Light / Dark theme" },
    { keys: ["?"], desc: "Toggle this Keyboard Shortcuts help sheet" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 backdrop-blur-xl text-gray-900 dark:text-white rounded-2xl p-6 max-w-[90vw] sm:max-w-md overflow-hidden shadow-2xl select-none animate-in fade-in zoom-in-95 duration-200 text-xs">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-slate-100 dark:border-gray-900">
          <DialogTitle className="text-lg font-extrabold flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <span className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Keyboard size={16} />
            </span>
            <span>Keyboard Command Center</span>
          </DialogTitle>
        </DialogHeader>

        {/* Shortcuts list */}
        <div className="py-4 space-y-3.5 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
          <div className="flex items-center gap-1.5 px-1 py-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            <HelpCircle size={12} />
            <span>Hotkey Command Sheet</span>
          </div>

          <div className="space-y-2">
            {shortcuts.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-gray-900/60 border border-slate-200/80 dark:border-gray-800/80 rounded-xl transition hover:bg-slate-100 dark:hover:bg-gray-900"
              >
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {s.desc}
                </span>
                <div className="flex gap-1">
                  {s.keys.map((k, kIdx) => (
                    <kbd
                      key={kIdx}
                      className="px-2 py-1 bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-850 rounded shadow font-mono text-[10px] font-extrabold text-gray-550 dark:text-gray-400 select-all border-b-2"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="pt-5 mt-4 border-t border-slate-100 dark:border-gray-900 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-5 shadow-lg shadow-blue-900/30"
          >
            Close Sheet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsDialog;
