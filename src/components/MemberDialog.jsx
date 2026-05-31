import { useState, useEffect } from "react";
import { X, Users, Plus, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "./ui/Dialog";
import { Button } from "./ui/Button";

const MemberDialog = ({ isOpen, onClose, onAddMember }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("👨‍💻");

  const emojiOptions = [
    "👨‍💻", "👩‍💻", "👨‍🎨", "👩‍🎨", "🚀", "🛡️",
    "🧪", "⚙️", "📈", "🧠", "👑", "⚡"
  ];

  useEffect(() => {
    if (isOpen) {
      setName("");
      setRole("");
      setAvatar("👨‍💻");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!name.trim() || !role.trim()) return;
    onAddMember({ name, role, avatar });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 backdrop-blur-xl text-gray-900 dark:text-white rounded-2xl p-6 max-w-[90vw] sm:max-w-md overflow-hidden shadow-2xl select-none animate-in fade-in zoom-in-95 duration-200 text-xs">
        <DialogHeader className="pb-4 border-b border-slate-100 dark:border-gray-900 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-extrabold flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <Users size={16} />
            </span>
            <span>Add Team Member</span>
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-4 pt-4">
          {/* Member Name */}
          <div className="space-y-1.5">
            <label htmlFor="member-name" className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={12} className="text-blue-600 dark:text-blue-400" />
              <span>Full Name</span>
            </label>
            <input
              id="member-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 rounded-xl px-3 py-2.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none transition"
              autoFocus
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label htmlFor="member-role" className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Award size={12} className="text-purple-600 dark:text-purple-400" />
              <span>Role / Position</span>
            </label>
            <input
              id="member-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. DevOps Engineer"
              className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 rounded-xl px-3 py-2.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none transition"
            />
          </div>

          {/* Emoji Avatar options */}
          <div className="space-y-1.5">
            <span className="font-bold text-gray-400 dark:text-gray-500 block uppercase tracking-wider mb-2">
              Select Emoji Avatar
            </span>
            <div className="grid grid-cols-6 gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  className={`text-xl p-2 rounded-xl border transition-all duration-150 hover:scale-110 ${
                    avatar === emoji
                      ? "bg-blue-500/10 border-blue-500/80 scale-105"
                      : "bg-slate-50 dark:bg-gray-900 border-slate-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  {emoji}
                </button>
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
            disabled={!name.trim() || !role.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-5 shadow-lg shadow-blue-900/30 disabled:opacity-50"
          >
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDialog;
