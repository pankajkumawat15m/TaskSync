import { useState } from "react";
import {
  LayoutDashboard,
  KanbanSquare,
  ListTodo,
  CalendarDays,
  Milestone,
  Settings,
  Database,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Sun,
  Moon,
  Folder,
  Trash2,
  Keyboard
} from "lucide-react";
import logo from "../assets/logotasksync.jpg";
import DeleteProjectDialog from "./DeleteProjectDialog";

const Sidebar = ({
  activeView,
  setActiveView,
  projects,
  activeProject,
  setActiveProject,
  activeUser,
  setActiveUser,
  members,
  apiMode,
  setApiMode,
  onAddProject,
  onDeleteProject,
  onResetDB,
  theme,
  toggleTheme,
  setIsShortcutsOpen,
  isProjectDialogOpen,
  setIsProjectDialogOpen,
  onExportBackup,
  onImportBackup,
  activeAccentColor,
  PROJECT_COLORS
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] = useState(false);

  const toggleAPIMode = () => {
    const nextMode = apiMode === "local" ? "server" : "local";
    setApiMode(nextMode);
  };

  const highlightClass = {
    blue: "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-900/30",
    purple: "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-900/30",
    emerald: "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-900/30",
    rose: "bg-gradient-to-r from-rose-600 to-pink-600 shadow-rose-900/30",
    amber: "bg-gradient-to-r from-amber-600 to-orange-600 shadow-amber-900/30"
  }[activeAccentColor || "blue"];

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "kanban", label: "Kanban Board", icon: KanbanSquare },
    { id: "list", label: "List View", icon: ListTodo },
    { id: "calendar", label: "Calendar", icon: CalendarDays },
    { id: "timeline", label: "Timeline", icon: Milestone }
  ];

  return (
    <aside
      className={`h-screen flex flex-col bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 text-gray-800 dark:text-white transition-all duration-300 relative z-30 shadow-2xl ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 -right-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 border border-gray-200 dark:border-gray-800 shadow-md transition-transform duration-200 hover:scale-110"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Header */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800/80 overflow-hidden">
        <img
          src={logo}
          alt="TaskSync"
          className="h-10 w-10 min-w-[40px] rounded-lg border-2 border-blue-500 bg-blue-950 p-0.5 object-cover"
        />
        {!isCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-lg leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
              TaskSync
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider uppercase">
              Enterprise Suite
            </span>
          </div>
        )}
      </div>

      {/* Project Switcher */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-900 overflow-hidden select-none">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                Active Project
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsDeleteProjectDialogOpen(true)}
                  disabled={projects.length <= 1}
                  className="text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 p-1.5 rounded-lg border border-slate-200 dark:border-gray-800 hover:scale-105 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  title="Delete Active Project"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => setIsProjectDialogOpen(true)}
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-900 p-1.5 rounded-lg border border-slate-200 dark:border-gray-800 hover:scale-105 transition-all"
                  title="Create Project"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="relative">
              <Folder size={14} className="absolute left-3 top-3 text-blue-600 dark:text-blue-400" />
              <select
                value={activeProject}
                onChange={(e) => setActiveProject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-xs rounded-xl pl-10 pr-8 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500/30 cursor-pointer font-bold text-gray-700 dark:text-gray-300 appearance-none shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-gray-950 text-gray-800 dark:text-white font-semibold">
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400 dark:text-gray-500 text-[10px] font-bold">
                ▼
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center text-blue-600 dark:text-blue-400 hover:scale-110 cursor-pointer transition"
            title="Create/Switch Projects"
            onClick={() => setIsProjectDialogOpen(true)}
          >
            <Plus size={20} className="border border-dashed border-gray-300 dark:border-gray-800 p-0.5 rounded-lg" />
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setShowSettings(false);
              }}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive && !showSettings
                  ? `${highlightClass} text-white shadow-lg`
                  : "text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-900/60 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon
                size={20}
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  isActive && !showSettings ? "text-cyan-200" : "text-gray-400 group-hover:text-blue-500"
                }`}
              />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        {/* Separator */}
        <div className="py-2">
          <div className="border-t border-gray-200 dark:border-gray-900" />
        </div>

        {/* System Settings Navigation */}
        <button
          onClick={() => {
            setShowSettings(!showSettings);
            setActiveView("");
          }}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
            showSettings
              ? "bg-gradient-to-r from-purple-600/90 to-pink-600/80 text-white shadow-lg shadow-purple-900/30"
              : "text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-900/60 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Settings
            size={20}
            className={`transition-transform duration-200 group-hover:scale-110 ${
              showSettings ? "text-pink-200" : "text-gray-400 group-hover:text-purple-500"
            }`}
          />
          {!isCollapsed && <span>System Settings</span>}
        </button>
      </nav>

      {/* Keyboard Command Center Trigger */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-900">
        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition duration-200 select-none"
        >
          <Keyboard size={18} className="text-blue-500" />
          {!isCollapsed && <span>Keyboard Command</span>}
        </button>
      </div>

      {/* Theme Switcher Toggle */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-900">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition duration-200 select-none"
        >
          {theme === "dark" ? (
            <>
              <Sun size={18} className="text-amber-500 animate-spin-slow" />
              {!isCollapsed && <span>Light Theme</span>}
            </>
          ) : (
            <>
              <Moon size={18} className="text-blue-500" />
              {!isCollapsed && <span>Dark Theme</span>}
            </>
          )}
        </button>
      </div>

      {/* User Switcher Widget */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-900 bg-gray-50 dark:bg-gray-950/80">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              <UserCheck size={12} />
              <span>Viewing As:</span>
            </div>
            <select
              value={activeUser}
              onChange={(e) => setActiveUser(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs rounded px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 dark:text-gray-300 font-medium"
            >
              {members.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.avatar} {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex justify-center text-blue-500 font-bold" title={`Current User: ${activeUser}`}>
            👤
          </div>
        )}
      </div>

      {/* Bottom Panel Settings Modal/Details if settings active */}
      {showSettings && !isCollapsed && (
        <div className="absolute bottom-16 left-4 right-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-2xl z-40 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
            <h4 className="text-xs font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase">
              Control Panel
            </h4>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {/* Database Toggle */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 block uppercase tracking-wider">
              Database Core
            </span>
            <button
              onClick={toggleAPIMode}
              className={`w-full flex items-center justify-between text-left text-xs p-2 rounded border transition ${
                apiMode === "server"
                  ? "bg-purple-50/10 border-purple-500 text-purple-600 dark:text-purple-200"
                  : "bg-blue-50/10 border-blue-500 text-blue-600 dark:text-blue-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Database size={14} />
                <span className="font-semibold capitalize">{apiMode} Mode</span>
              </div>
              <span className="text-[10px] bg-black/5 dark:bg-black/40 px-1.5 py-0.5 rounded font-bold">
                Toggle
              </span>
            </button>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 leading-normal">
              {apiMode === "server"
                ? "Connecting to local PostgreSQL / Express API."
                : "Using high-speed sandboxed browser LocalStorage."}
            </p>
          </div>

          {/* Workspace Backup */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 block uppercase tracking-wider">
              Workspace Backup
            </span>
            <div className="flex gap-2">
              <button
                onClick={onExportBackup}
                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-500/5 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500 text-blue-600 dark:text-blue-200 rounded p-1.5 text-[10px] font-semibold transition"
              >
                <span>Export JSON</span>
              </button>
              <button
                onClick={onImportBackup}
                className="flex-1 flex items-center justify-center gap-1.5 bg-purple-500/5 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500 text-purple-600 dark:text-purple-200 rounded p-1.5 text-[10px] font-semibold transition"
              >
                <span>Import JSON</span>
              </button>
            </div>
          </div>

          {/* System Reset */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 block uppercase tracking-wider">
              Data Actions
            </span>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all tasks, projects and comments to default seed values?")) {
                  onResetDB();
                  setShowSettings(false);
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-500/5 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 text-red-600 dark:text-red-200 rounded p-2 text-xs font-semibold transition"
            >
              <RefreshCw size={12} />
              <span>Reset & Seed DB</span>
            </button>
          </div>
        </div>
      )}

      {/* Beautiful Modal Delete Project Dialog */}
      <DeleteProjectDialog
        isOpen={isDeleteProjectDialogOpen}
        onClose={() => setIsDeleteProjectDialogOpen(false)}
        projectName={projects.find((p) => p.id === activeProject)?.name || "Project"}
        onDelete={() => {
          onDeleteProject(activeProject);
          setIsDeleteProjectDialogOpen(false);
        }}
      />
    </aside>
  );
};

export default Sidebar;
