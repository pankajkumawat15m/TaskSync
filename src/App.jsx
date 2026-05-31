import { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import KanbanBoard from "./components/KanbanBoard";
import DashboardView from "./components/DashboardView";
import ListView from "./components/ListView";
import CalendarView from "./components/CalendarView";
import TimelineView from "./components/TimelineView";
import TaskDrawer from "./components/TaskDrawer";
import KeyboardShortcutsDialog from "./components/KeyboardShortcutsDialog";
import ProjectDialog from "./components/ProjectDialog";
import MemberDialog from "./components/MemberDialog";
import TaskDialog from "./components/TaskDialog";
import CommandPalette from "./components/CommandPalette";
import { api } from "./services/api";

const PROJECT_COLORS = {
  blue: {
    accent: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500",
    ring: "focus:ring-blue-500/30",
    button: "bg-blue-600 hover:bg-blue-700 shadow-blue-900/30",
    borderHover: "hover:border-blue-500",
    gantt: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30"
  },
  purple: {
    accent: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500",
    ring: "focus:ring-purple-500/30",
    button: "bg-purple-600 hover:bg-purple-700 shadow-purple-900/30",
    borderHover: "hover:border-purple-500",
    gantt: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30"
  },
  emerald: {
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500",
    ring: "focus:ring-emerald-500/30",
    button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/30",
    borderHover: "hover:border-emerald-500",
    gantt: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
  },
  rose: {
    accent: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500",
    ring: "focus:ring-rose-500/30",
    button: "bg-rose-600 hover:bg-rose-700 shadow-rose-900/30",
    borderHover: "hover:border-rose-500",
    gantt: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30"
  },
  amber: {
    accent: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500",
    ring: "focus:ring-amber-500/30",
    button: "bg-amber-600 hover:bg-amber-700 shadow-amber-900/30",
    borderHover: "hover:border-amber-500",
    gantt: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30"
  }
};

function App() {
  const [activeView, setActiveView] = useState("kanban");
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState("");
  const [members, setMembers] = useState([]);
  const [activeUser, setActiveUser] = useState("");
  const [tasks, setTasks] = useState([]);
  const [columnsList, setColumnsList] = useState(["todo", "inProgress", "inReview", "done"]);
  const [apiMode, setApiMode] = useState("local");
  const [isLoading, setIsLoading] = useState(true);

  // Theme state: default to dark, support light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("ts_theme") || "dark";
  });

  // Detail Drawer state
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Lifted dialog states for Command Palette and Action hotkeys
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [defaultTaskColumn, setDefaultTaskColumn] = useState("todo");
  const [defaultTaskDeadline, setDefaultTaskDeadline] = useState("");

  const handleOpenTaskDialog = (column = "todo", deadline = "") => {
    setDefaultTaskColumn(column);
    setDefaultTaskDeadline(deadline);
    setIsTaskDialogOpen(true);
  };

  // Sync theme with DOM root class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("ts_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // command center and floating toasts state
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Global mechanical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Trigger Command Palette
      if ((e.ctrlKey || e.metaKey) && key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      switch (key) {
        case "k":
          setActiveView("kanban");
          setIsDrawerOpen(false);
          showToast("Switched to Kanban Board", "info");
          break;
        case "d":
          setActiveView("dashboard");
          setIsDrawerOpen(false);
          showToast("Switched to Dashboard Analytics", "info");
          break;
        case "l":
          setActiveView("list");
          setIsDrawerOpen(false);
          showToast("Switched to Spreadsheet List", "info");
          break;
        case "c":
          setActiveView("calendar");
          setIsDrawerOpen(false);
          showToast("Switched to Deadline Calendar", "info");
          break;
        case "t":
          setActiveView("timeline");
          setIsDrawerOpen(false);
          showToast("Switched to Sprint Timeline Roadmap", "info");
          break;
        case "o":
          e.preventDefault();
          toggleTheme();
          showToast("Theme toggled successfully", "info");
          break;
        case "n":
          e.preventDefault();
          handleOpenTaskDialog("todo");
          showToast("Opened Create Task dialogue", "info");
          break;
        case "p":
          e.preventDefault();
          setIsProjectDialogOpen(true);
          showToast("Opened Create Project dialogue", "info");
          break;
        case "m":
          e.preventDefault();
          setIsMemberDialogOpen(true);
          showToast("Opened Add Team Member dialogue", "info");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme, showToast]);

  // Initialize and load core system records
  const loadWorkspaceConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const mode = api.getAPIMode();
      setApiMode(mode);

      const activeProjId = api.getActiveProject();
      setActiveProject(activeProjId);

      const user = api.getActiveUser();
      setActiveUser(user);

      const allProjects = await api.getProjects();
      setProjects(allProjects);

      const allMembers = await api.getMembers();
      setMembers(allMembers);

      // Verify that active project exists in database, fallback to first
      let currentProjId = activeProjId;
      if (allProjects.length > 0 && !allProjects.some((p) => p.id === activeProjId)) {
        currentProjId = allProjects[0].id;
        setActiveProject(currentProjId);
        api.setActiveProject(currentProjId);
      }

      if (currentProjId) {
        const projectTasks = await api.getTasksForProject(currentProjId);
        setTasks(projectTasks);

        const cols = await api.getColumnsForProject(currentProjId);
        setColumnsList(Object.keys(cols));
      }
    } catch (error) {
      console.error("Error loading workspace configurations", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspaceConfig();
  }, [loadWorkspaceConfig]);

  // Handle active project change
  const handleActiveProjectChange = async (projId) => {
    setActiveProject(projId);
    api.setActiveProject(projId);
    setIsLoading(true);
    try {
      const projectTasks = await api.getTasksForProject(projId);
      setTasks(projectTasks);

      const cols = await api.getColumnsForProject(projId);
      setColumnsList(Object.keys(cols));
      showToast("Workspace switched successfully", "info");
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle active user change
  const handleActiveUserChange = (user) => {
    setActiveUser(user);
    api.setActiveUser(user);
    showToast(`Switched persona to ${user}`, "info");
  };

  // Add Project
  const handleAddProject = async (name, description, color = "blue") => {
    const newProj = await api.addProject(name, description || `Created on ${new Date().toLocaleDateString()}`, color);
    const updatedProjects = await api.getProjects();
    setProjects(updatedProjects);
    handleActiveProjectChange(newProj.id);
    showToast(`Project "${name}" created!`, "success");
  };

  // Export Workspace Backup (JSON)
  const handleExportBackup = async () => {
    try {
      const allProjects = await api.getProjects();
      const allMembers = await api.getMembers();
      let allTasks = [];
      for (const p of allProjects) {
        const pTasks = await api.getTasksForProject(p.id);
        allTasks.push(...pTasks);
      }
      
      const backupData = {
        version: "2.0.0",
        timestamp: new Date().toISOString(),
        projects: allProjects,
        members: allMembers,
        tasks: allTasks
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tasksync_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Workspace backup exported successfully!", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to export workspace backup", "error");
    }
  };

  // Import Workspace Backup
  const handleImportBackup = async (file) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (!imported.projects || !imported.tasks || !imported.members) {
            showToast("Invalid backup file structure!", "error");
            return;
          }
          
          localStorage.setItem("ts_projects", JSON.stringify(imported.projects));
          localStorage.setItem("ts_members", JSON.stringify(imported.members));
          localStorage.setItem("ts_tasks", JSON.stringify(imported.tasks));
          
          const cols = {};
          imported.projects.forEach(p => {
            cols[p.id] = { todo: [], inProgress: [], done: [] };
          });
          localStorage.setItem("ts_columns", JSON.stringify(cols));
          
          showToast("Workspace database restored successfully!", "success");
          setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
          showToast("Failed to parse backup JSON!", "error");
        }
      };
      reader.readAsText(file);
    } catch (e) {
      showToast("Failed to read backup file!", "error");
    }
  };

  // Delete Project
  const handleDeleteProject = async (projectId) => {
    setIsLoading(true);
    try {
      await api.deleteProject(projectId);
      const updatedProjects = await api.getProjects();
      setProjects(updatedProjects);
      
      // Fallback active project to the first project or empty
      const nextActiveProj = updatedProjects.length > 0 ? updatedProjects[0].id : "";
      await handleActiveProjectChange(nextActiveProj);
      showToast("Project deleted successfully", "success");
    } catch (e) {
      console.error("Error deleting project", e);
      showToast("Failed to delete project", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Add Team Member (Assignee)
  const handleAddMember = async (memberData) => {
    await api.addMember(memberData.name, memberData.role, memberData.avatar);
    const updatedMembers = await api.getMembers();
    setMembers(updatedMembers);
    showToast(`Added team member ${memberData.name}`, "success");
  };

  // Database actions
  const handleResetDB = async () => {
    setIsLoading(true);
    await api.resetDB();
    await loadWorkspaceConfig();
    showToast("System database reset successfully", "success");
  };

  // Refresh Tasks
  const refreshTasks = async () => {
    if (activeProject) {
      const projectTasks = await api.getTasksForProject(activeProject);
      setTasks(projectTasks);
      // Sync selected task inside drawer
      if (selectedTask) {
        const synced = projectTasks.find((t) => t.id === selectedTask.id);
        setSelectedTask(synced || null);
      }
    }
  };

  // Task Operations
  const handleAddTask = async (taskData) => {
    const newTask = await api.addTask({
      ...taskData,
      projectId: activeProject,
    });
    await refreshTasks();
    showToast("Task created successfully", "success");
    return newTask;
  };

  const handleUpdateTask = async (taskData) => {
    await api.updateTask(taskData);
    await refreshTasks();
    showToast("Task details updated", "success");
  };

  const handleDeleteTask = async (taskId) => {
    await api.deleteTask(taskId);
    if (selectedTask?.id === taskId) {
      setIsDrawerOpen(false);
      setSelectedTask(null);
    }
    await refreshTasks();
    showToast("Task deleted successfully", "success");
  };

  const handleOpenTaskDetails = (task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  // Render correct panel
  const renderActiveView = () => {
    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-gray-900 text-gray-900 dark:text-white transition duration-200">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Syncing Workspace details...</p>
          </div>
        </div>
      );
    }

    const activeProjectObj = projects.find((p) => p.id === activeProject) || { color: "blue" };
    const activeAccentColor = activeProjectObj.color || "blue";

    const commonProps = {
      tasks,
      members,
      activeProject,
      activeAccentColor,
      PROJECT_COLORS,
      onAddTask: handleAddTask,
      onUpdateTask: handleUpdateTask,
      onDeleteTask: handleDeleteTask,
      onOpenTaskDetails: handleOpenTaskDetails,
      onAddMember: handleAddMember,
      onOpenTaskDialog: handleOpenTaskDialog,
      onOpenMemberDialog: () => setIsMemberDialogOpen(true)
    };

    switch (activeView) {
      case "dashboard":
        return <DashboardView {...commonProps} projects={projects} />;
      case "kanban":
        return <KanbanBoard {...commonProps} />;
      case "list":
        return <ListView {...commonProps} />;
      case "calendar":
        return <CalendarView {...commonProps} />;
      case "timeline":
        return <TimelineView {...commonProps} />;
      default:
        return <KanbanBoard {...commonProps} />;
    }
  };

  const activeProjectObj = projects.find((p) => p.id === activeProject) || { color: "blue" };
  const activeAccentColor = activeProjectObj.color || "blue";

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans overflow-hidden transition-colors duration-200">
      {/* Navigation Shell */}
      <Sidebar
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          setIsDrawerOpen(false); // Close drawer when switching views
        }}
        projects={projects}
        activeProject={activeProject}
        setActiveProject={handleActiveProjectChange}
        activeUser={activeUser}
        setActiveUser={handleActiveUserChange}
        members={members}
        apiMode={apiMode}
        setApiMode={(mode) => api.setAPIMode(mode)}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        onResetDB={handleResetDB}
        theme={theme}
        toggleTheme={toggleTheme}
        setIsShortcutsOpen={setIsShortcutsOpen}
        isProjectDialogOpen={isProjectDialogOpen}
        setIsProjectDialogOpen={setIsProjectDialogOpen}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        activeAccentColor={activeAccentColor}
        PROJECT_COLORS={PROJECT_COLORS}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {renderActiveView()}
      </main>

      {/* Slide-out Task Detail Drawer */}
      <TaskDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        members={members}
        columns={columnsList}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        activeUser={activeUser}
      />

      {/* Keyboard Command Center Dialog */}
      <KeyboardShortcutsDialog
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Global Lifted Dialogs & Command Palette */}
      <ProjectDialog
        isOpen={isProjectDialogOpen}
        onClose={() => setIsProjectDialogOpen(false)}
        onAddProject={handleAddProject}
      />

      <MemberDialog
        isOpen={isMemberDialogOpen}
        onClose={() => setIsMemberDialogOpen(false)}
        onAddMember={handleAddMember}
      />

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setDefaultTaskColumn("todo");
          setDefaultTaskDeadline("");
        }}
        columns={columnsList}
        onAddTask={handleAddTask}
        selectedColumn={defaultTaskColumn}
        defaultDeadline={defaultTaskDeadline}
        members={members}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tasks={tasks}
        projects={projects}
        activeView={activeView}
        setActiveView={setActiveView}
        setActiveProject={handleActiveProjectChange}
        onOpenTaskDetails={handleOpenTaskDetails}
        toggleTheme={toggleTheme}
        theme={theme}
        triggerCreateTask={() => handleOpenTaskDialog("todo")}
        triggerCreateProject={() => setIsProjectDialogOpen(true)}
        triggerAddMember={() => setIsMemberDialogOpen(true)}
        triggerBackupExport={handleExportBackup}
        triggerBackupImport={() => document.getElementById("import-backup-file")?.click()}
      />
      <input
        id="import-backup-file"
        type="file"
        accept=".json"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleImportBackup(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Floating Glassmorphic Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none select-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 bg-white/90 dark:bg-gray-950/90 border border-slate-200 dark:border-gray-800 backdrop-blur-xl rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300 text-xs font-bold text-gray-800 dark:text-white"
          >
            <span className="text-sm">
              {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "ℹ️"}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
