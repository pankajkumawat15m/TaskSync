import { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  Terminal,
  FileText,
  Eye,
  Settings,
  Sun,
  Moon,
  Plus,
  UserPlus,
  FolderPlus,
  Download,
  Upload,
  ArrowRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "./ui/Dialog";

const CommandPalette = ({
  isOpen,
  onClose,
  tasks,
  projects,
  activeView,
  setActiveView,
  setActiveProject,
  onOpenTaskDetails,
  toggleTheme,
  theme,
  triggerCreateTask,
  triggerCreateProject,
  triggerAddMember,
  triggerBackupExport,
  triggerBackupImport
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Command Palette Items Config
  const staticCommands = useMemo(() => [
    {
      id: "nav-kanban",
      label: "Go to Kanban Board",
      category: "Navigation",
      shortcut: "K",
      icon: Terminal,
      action: () => {
        setActiveView("kanban");
        onClose();
      }
    },
    {
      id: "nav-dashboard",
      label: "Go to Executive Dashboard",
      category: "Navigation",
      shortcut: "D",
      icon: Eye,
      action: () => {
        setActiveView("dashboard");
        onClose();
      }
    },
    {
      id: "nav-list",
      label: "Go to Dense List View",
      category: "Navigation",
      shortcut: "L",
      icon: Eye,
      action: () => {
        setActiveView("list");
        onClose();
      }
    },
    {
      id: "nav-calendar",
      label: "Go to Deadline Calendar",
      category: "Navigation",
      shortcut: "C",
      icon: Eye,
      action: () => {
        setActiveView("calendar");
        onClose();
      }
    },
    {
      id: "nav-timeline",
      label: "Go to Sprint Timeline Roadmap",
      category: "Navigation",
      shortcut: "T",
      icon: Eye,
      action: () => {
        setActiveView("timeline");
        onClose();
      }
    },
    {
      id: "action-new-task",
      label: "Create New Task",
      category: "Quick Actions",
      shortcut: "N",
      icon: Plus,
      action: () => {
        onClose();
        setTimeout(() => triggerCreateTask(), 100);
      }
    },
    {
      id: "action-new-project",
      label: "Create New Project Workspace",
      category: "Quick Actions",
      shortcut: "P",
      icon: FolderPlus,
      action: () => {
        onClose();
        setTimeout(() => triggerCreateProject(), 100);
      }
    },
    {
      id: "action-new-member",
      label: "Add New Team Member Persona",
      category: "Quick Actions",
      shortcut: "M",
      icon: UserPlus,
      action: () => {
        onClose();
        setTimeout(() => triggerAddMember(), 100);
      }
    },
    {
      id: "action-toggle-theme",
      label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      category: "Preferences",
      shortcut: "O",
      icon: theme === "dark" ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      }
    },
    {
      id: "action-export-backup",
      label: "Export Workspace Database Backup (JSON)",
      category: "Maintenance",
      shortcut: "Ctrl+S",
      icon: Download,
      action: () => {
        triggerBackupExport();
        onClose();
      }
    },
    {
      id: "action-import-backup",
      label: "Import Workspace Database Backup",
      category: "Maintenance",
      icon: Upload,
      action: () => {
        triggerBackupImport();
        onClose();
      }
    }
  ], [theme, toggleTheme, setActiveView, triggerCreateTask, triggerCreateProject, triggerAddMember, triggerBackupExport, triggerBackupImport, onClose]);

  // Dynamic search matching
  const filteredItems = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) {
      return staticCommands;
    }

    // Search static commands
    const matchedCommands = staticCommands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(cleanQuery) ||
        cmd.category.toLowerCase().includes(cleanQuery)
    );

    // Search tasks
    const matchedTasks = tasks
      .filter(
        (task) =>
          task.content.toLowerCase().includes(cleanQuery) ||
          (task.description && task.description.toLowerCase().includes(cleanQuery)) ||
          task.id.toLowerCase().includes(cleanQuery)
      )
      .map((task) => {
        const proj = projects.find((p) => p.id === task.projectId);
        return {
          id: `task-${task.id}`,
          label: task.content,
          category: `Task (Project: ${proj ? proj.name : "Unknown"})`,
          icon: FileText,
          shortcut: task.id.toUpperCase(),
          action: () => {
            onClose();
            setTimeout(() => onOpenTaskDetails(task), 100);
          }
        };
      });

    // Search projects
    const matchedProjects = projects
      .filter((proj) => proj.name.toLowerCase().includes(cleanQuery))
      .map((proj) => ({
        id: `proj-${proj.id}`,
        label: `Switch Board: ${proj.name}`,
        category: "Projects",
        icon: Terminal,
        action: () => {
          setActiveProject(proj.id);
          onClose();
        }
      }));

    return [...matchedCommands, ...matchedProjects, ...matchedTasks];
  }, [query, staticCommands, tasks, projects, onOpenTaskDetails, setActiveProject, onClose]);

  // Keep index clamped when items count changes
  useEffect(() => {
    setSelectedIndex((prev) => Math.min(prev, Math.max(0, filteredItems.length - 1)));
  }, [filteredItems]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-white/95 dark:bg-gray-950/95 border border-slate-200 dark:border-gray-800/80 backdrop-blur-2xl text-gray-900 dark:text-white rounded-2xl max-w-[90vw] sm:max-w-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-12 duration-200 select-none">
        {/* Search Input bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-gray-900">
          <Search className="text-gray-400 dark:text-gray-500 flex-shrink-0" size={18} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a task, project, or command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm focus:outline-none border-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-semibold"
          />
          <span className="text-[10px] bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-850 px-2 py-0.5 rounded text-gray-400 dark:text-gray-500 font-bold select-none">
            ESC
          </span>
        </div>

        {/* Query Results list */}
        <div
          ref={listRef}
          className="max-h-[360px] overflow-y-auto p-2 space-y-0.5 scrollbar-thin select-none"
        >
          {filteredItems.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedIndex(idx);
                  item.action();
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-xs font-semibold select-none transition duration-150 ${
                  isSelected
                    ? "bg-blue-600/90 dark:bg-blue-600/20 border border-blue-500/30 text-white dark:text-blue-300"
                    : "border border-transparent text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-900/60"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Icon
                    size={16}
                    className={`flex-shrink-0 ${
                      isSelected
                        ? "text-white dark:text-blue-300"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{item.label}</span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider ${
                        isSelected
                          ? "text-blue-200/80 dark:text-blue-400/80"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {item.shortcut && (
                    <kbd
                      className={`px-1.5 py-0.5 border rounded font-mono text-[9px] font-bold ${
                        isSelected
                          ? "bg-blue-700/85 dark:bg-blue-950/40 border-blue-400/30 text-white"
                          : "bg-white dark:bg-gray-950 border-slate-200 dark:border-gray-800 text-gray-400"
                      }`}
                    >
                      {item.shortcut}
                    </kbd>
                  )}
                  {isSelected && <ArrowRight size={12} className="animate-pulse" />}
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 font-semibold select-none">
              🚫 No tasks, boards, or actions matched your search.
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-gray-900 bg-slate-50 dark:bg-gray-950/60 text-[10px] text-gray-400 dark:text-gray-500 flex justify-between items-center select-none">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <div>TaskSync command panel</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
