// Robust Mock Database Service using LocalStorage
// Implements full relational operations for Projects, Tasks, Members, Comments, and Activity Logs.

const DEFAULT_PROJECTS = [
  { id: "proj-1", name: "🚀 TaskSync Enterprise Upgrade", description: "Main roadmap to build the enterprise-grade task manager", color: "blue" },
  { id: "proj-2", name: "📢 Marketing & Launch Q3", description: "Campaigns and content for the official product rollout", color: "amber" },
  { id: "proj-3", name: "🔒 Security & SOC2 Compliance", description: "Audit logs, credentials hardening, and security features", color: "purple" }
];

const DEFAULT_MEMBERS = [
  { id: "mem-1", name: "Aarav", avatar: "👨‍💻", role: "Frontend Lead" },
  { id: "mem-2", name: "Ananya", avatar: "👩‍🎨", role: "UI/UX Designer" },
  { id: "mem-3", name: "Arjun", avatar: "🛡️", role: "SecOps Architect" },
  { id: "mem-4", name: "Diya", avatar: "📊", role: "Product Manager" },
  { id: "mem-5", name: "Ishaan", avatar: "⚙️", role: "DevOps Engineer" },
  { id: "mem-6", name: "Kavya", avatar: "🧪", role: "QA Lead" },
  { id: "mem-7", name: "Rahul", avatar: "🖥️", role: "Fullstack Dev" },
  { id: "mem-8", name: "Saanvi", avatar: "📈", role: "Growth Specialist" },
  { id: "mem-9", name: "Vikram", avatar: "🔐", role: "Security Engineer" },
  { id: "mem-10", name: "Zara", avatar: "🚀", role: "Engineering Lead" }
];

const DEFAULT_TASKS = [
  // Project 1 tasks
  {
    id: "task-1",
    projectId: "proj-1",
    content: "Implement drag-and-drop board reordering",
    description: "Rebuild the Kanban columns and cards using @dnd-kit/core and @dnd-kit/sortable to allow smooth dragging of tasks across states.",
    priority: "high",
    column: "inProgress",
    date: "2026-05-20",
    deadline: "2026-06-05",
    username: "Aarav",
    timeSpent: "4h 30m",
    timeEstimate: "8h",
    subtasks: [
      { id: "sub-1-1", content: "Integrate DndContext and SortableContext", completed: true },
      { id: "sub-1-2", content: "Implement custom active drag overlays", completed: false },
      { id: "sub-1-3", content: "Add drag handle to cards and columns", completed: false }
    ],
    comments: [
      { id: "comm-1-1", username: "Ananya", text: "I've uploaded the visual drag designs to the drive!", date: "2026-05-28T10:14:00.000Z" },
      { id: "comm-1-2", username: "Aarav", text: "Perfect, matching the glassmorphic styling now.", date: "2026-05-29T14:22:00.000Z" }
    ],
    activities: [
      { id: "act-1-1", username: "Aarav", text: "created this task", date: "2026-05-20T09:00:00.000Z" },
      { id: "act-1-2", username: "Diya", text: "changed priority to High", date: "2026-05-21T11:30:00.000Z" },
      { id: "act-1-3", username: "Aarav", text: "moved task from ToDo to In Progress", date: "2026-05-25T16:45:00.000Z" }
    ]
  },
  {
    id: "task-2",
    projectId: "proj-1",
    content: "Create dynamic Executive Dashboard",
    description: "Build a sleek executive stats view featuring active task metric cards, SVG-based charts tracking workload/priorities, and real-time logs.",
    priority: "high",
    column: "todo",
    date: "2026-05-24",
    deadline: "2026-06-10",
    username: "Ananya",
    timeSpent: "0h",
    timeEstimate: "12h",
    subtasks: [
      { id: "sub-2-1", content: "Design glowing metric cards", completed: false },
      { id: "sub-2-2", content: "Create dynamic SVG distribution pie chart", completed: false },
      { id: "sub-2-3", content: "Add scrolling recent activity logs widget", completed: false }
    ],
    comments: [],
    activities: [
      { id: "act-2-1", username: "Diya", text: "created this task", date: "2026-05-24T14:15:00.000Z" }
    ]
  },
  {
    id: "task-3",
    projectId: "proj-1",
    content: "Design high-fidelity Task Detail Drawer",
    description: "Replace standard alert modals with a sliding Linear-style drawer. Needs markdown description editing, comments widget, subtask progress, and time tracker.",
    priority: "medium",
    column: "inProgress",
    date: "2026-05-25",
    deadline: "2026-06-02",
    username: "Zara",
    timeSpent: "6h 15m",
    timeEstimate: "10h",
    subtasks: [
      { id: "sub-3-1", content: "Develop collapsible drawer layout", completed: true },
      { id: "sub-3-2", content: "Create inline description editor", completed: true },
      { id: "sub-3-3", content: "Implement subtask checkoff & progress slider", completed: false }
    ],
    comments: [
      { id: "comm-3-1", username: "Zara", text: "Drawer transitions feel extremely fluid.", date: "2026-05-28T09:05:00.000Z" }
    ],
    activities: [
      { id: "act-3-1", username: "Zara", text: "created this task", date: "2026-05-25T08:30:00.000Z" },
      { id: "act-3-2", username: "Zara", text: "completed subtask 'Develop collapsible drawer layout'", date: "2026-05-27T18:20:00.000Z" }
    ]
  },
  {
    id: "task-4",
    projectId: "proj-1",
    content: "Refactor stylesheet for global HSL Dark Theme",
    description: "Fine-tune index.css with comprehensive HSL custom utility variables and apply a glassmorphic look across components.",
    priority: "low",
    column: "inReview",
    date: "2026-05-26",
    deadline: "2026-05-30",
    username: "Rahul",
    timeSpent: "5h",
    timeEstimate: "5h",
    subtasks: [
      { id: "sub-4-1", content: "Configure root and dark HSL values", completed: true },
      { id: "sub-4-2", content: "Create .glow-effect cards", completed: true }
    ],
    comments: [
      { id: "comm-4-1", username: "Aarav", text: "Reviewing this now, looks absolutely stunning on high-DPI displays!", date: "2026-05-30T16:00:00.000Z" }
    ],
    activities: [
      { id: "act-4-1", username: "Rahul", text: "created this task", date: "2026-05-26T10:00:00.000Z" },
      { id: "act-4-2", username: "Rahul", text: "moved task from In Progress to In Review", date: "2026-05-30T17:15:00.000Z" }
    ]
  },
  {
    id: "task-5",
    projectId: "proj-1",
    content: "Write production ready PostgreSQL schema",
    description: "Write structural SQL queries to set up the tasks, subtasks, projects, comments, and members tables. Incorporate indexes for fast queries.",
    priority: "high",
    column: "todo",
    date: "2026-05-28",
    deadline: "2026-06-08",
    username: "Vikram",
    timeSpent: "0h",
    timeEstimate: "6h",
    subtasks: [
      { id: "sub-5-1", content: "Define table layout and primary/foreign keys", completed: false },
      { id: "sub-5-2", content: "Create indexes on task assignments and project IDs", completed: false }
    ],
    comments: [],
    activities: [
      { id: "act-5-1", username: "Vikram", text: "created this task", date: "2026-05-28T11:45:00.000Z" }
    ]
  },
  // Project 2 tasks
  {
    id: "task-201",
    projectId: "proj-2",
    content: "Draft launch announcement blog post",
    description: "Write an engaging, technical blog post detailing the new features in TaskSync, such as dynamic dashboards and timeline Roadmaps.",
    priority: "medium",
    column: "inProgress",
    date: "2026-05-25",
    deadline: "2026-06-15",
    username: "Saanvi",
    timeSpent: "2h",
    timeEstimate: "4h",
    subtasks: [
      { id: "sub-201-1", content: "Outline key topics", completed: true },
      { id: "sub-201-2", content: "Write feature highlights section", completed: false }
    ],
    comments: [],
    activities: []
  },
  // Project 3 tasks
  {
    id: "task-301",
    projectId: "proj-3",
    content: "Configure express audit log security headers",
    description: "Add Helmet and rate limiting middleware to prevent DOS and clickjacking. Verify that JWT tokens are safely stored.",
    priority: "high",
    column: "done",
    date: "2026-05-20",
    deadline: "2026-05-28",
    username: "Arjun",
    timeSpent: "3h 30m",
    timeEstimate: "3h 30m",
    subtasks: [
      { id: "sub-301-1", content: "Install helmet middleware", completed: true },
      { id: "sub-301-2", content: "Configure custom CORS policy", completed: true }
    ],
    comments: [],
    activities: []
  }
];

const initializeDB = () => {
  if (!localStorage.getItem("ts_projects")) {
    localStorage.setItem("ts_projects", JSON.stringify(DEFAULT_PROJECTS));
  }
  if (!localStorage.getItem("ts_members")) {
    localStorage.setItem("ts_members", JSON.stringify(DEFAULT_MEMBERS));
  }
  if (!localStorage.getItem("ts_tasks")) {
    localStorage.setItem("ts_tasks", JSON.stringify(DEFAULT_TASKS));
  }
  if (!localStorage.getItem("ts_active_project")) {
    localStorage.setItem("ts_active_project", "proj-1");
  }
  if (!localStorage.getItem("ts_active_user")) {
    localStorage.setItem("ts_active_user", "Aarav");
  }
  if (!localStorage.getItem("ts_api_mode")) {
    localStorage.setItem("ts_api_mode", "local");
  }
  if (!localStorage.getItem("ts_columns")) {
    // Column definitions per project, key is projectId
    const defaultCols = {
      "proj-1": { todo: [], inProgress: [], inReview: [], done: [] },
      "proj-2": { todo: [], inProgress: [], done: [] },
      "proj-3": { todo: [], inProgress: [], done: [] }
    };
    localStorage.setItem("ts_columns", JSON.stringify(defaultCols));
  }
};

initializeDB();

export const mockDB = {
  // Config
  getAPIMode: () => localStorage.getItem("ts_api_mode") || "local",
  setAPIMode: (mode) => localStorage.setItem("ts_api_mode", mode),

  getActiveProject: () => localStorage.getItem("ts_active_project") || "proj-1",
  setActiveProject: (id) => localStorage.setItem("ts_active_project", id),

  getActiveUser: () => localStorage.getItem("ts_active_user") || "Aarav",
  setActiveUser: (username) => localStorage.setItem("ts_active_user", username),

  // Reset
  resetDB: () => {
    localStorage.removeItem("ts_projects");
    localStorage.removeItem("ts_members");
    localStorage.removeItem("ts_tasks");
    localStorage.removeItem("ts_columns");
    initializeDB();
    return true;
  },

  // Projects
  getProjects: () => JSON.parse(localStorage.getItem("ts_projects")),
  addProject: (name, description, color = "blue") => {
    const projects = mockDB.getProjects();
    const id = "proj-" + Date.now();
    const newProj = { id, name, description, color };
    projects.push(newProj);
    localStorage.setItem("ts_projects", JSON.stringify(projects));

    // Seed columns for project
    const cols = JSON.parse(localStorage.getItem("ts_columns")) || {};
    cols[id] = { todo: [], inProgress: [], done: [] };
    localStorage.setItem("ts_columns", JSON.stringify(cols));
    return newProj;
  },
  deleteProject: (projectId) => {
    let projects = mockDB.getProjects();
    projects = projects.filter((p) => p.id !== projectId);
    localStorage.setItem("ts_projects", JSON.stringify(projects));

    // Also delete columns config
    const cols = JSON.parse(localStorage.getItem("ts_columns")) || {};
    delete cols[projectId];
    localStorage.setItem("ts_columns", JSON.stringify(cols));

    // Also delete all tasks belonging to project
    const tasks = mockDB.getTasks();
    const filteredTasks = tasks.filter((t) => t.projectId !== projectId);
    localStorage.setItem("ts_tasks", JSON.stringify(filteredTasks));

    return true;
  },

  // Columns Configuration
  getColumnsForProject: (projectId) => {
    const cols = JSON.parse(localStorage.getItem("ts_columns")) || {};
    if (!cols[projectId]) {
      cols[projectId] = { todo: [], inProgress: [], done: [] };
      localStorage.setItem("ts_columns", JSON.stringify(cols));
    }
    return cols[projectId];
  },
  saveColumnsForProject: (projectId, columnsData) => {
    const cols = JSON.parse(localStorage.getItem("ts_columns")) || {};
    cols[projectId] = columnsData;
    localStorage.setItem("ts_columns", JSON.stringify(cols));
  },

  // Members
  getMembers: () => JSON.parse(localStorage.getItem("ts_members")),
  addMember: (name, role, avatar) => {
    const members = mockDB.getMembers();
    const id = "mem-" + Date.now();
    const newMember = { id, name, role, avatar: avatar || "👤" };
    members.push(newMember);
    localStorage.setItem("ts_members", JSON.stringify(members));
    return newMember;
  },

  // Tasks
  getTasks: () => JSON.parse(localStorage.getItem("ts_tasks")),
  getTasksForProject: (projectId) => {
    const tasks = mockDB.getTasks();
    return tasks.filter((t) => t.projectId === projectId);
  },
  addTask: (taskData) => {
    const tasks = mockDB.getTasks();
    const activeUser = mockDB.getActiveUser();
    const newTask = {
      id: "task-" + Date.now(),
      subtasks: [],
      comments: [],
      timeSpent: "0h",
      timeEstimate: taskData.timeEstimate || "4h",
      ...taskData,
      date: taskData.date || new Date().toISOString().split("T")[0],
      activities: [
        {
          id: "act-" + Date.now(),
          username: activeUser,
          text: "created this task",
          date: new Date().toISOString()
        }
      ]
    };
    tasks.push(newTask);
    localStorage.setItem("ts_tasks", JSON.stringify(tasks));
    return newTask;
  },
  updateTask: (updatedTask) => {
    const tasks = mockDB.getTasks();
    const index = tasks.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      // Keep activities and comments unless explicitly replaced
      const prevTask = tasks[index];
      const mergedTask = {
        ...prevTask,
        ...updatedTask,
        subtasks: updatedTask.subtasks || prevTask.subtasks || [],
        comments: updatedTask.comments || prevTask.comments || [],
        activities: updatedTask.activities || prevTask.activities || []
      };

      // Check if column state changed to add action log
      if (prevTask.column !== updatedTask.column) {
        const activeUser = mockDB.getActiveUser();
        const cleanOld = prevTask.column.replace(/([A-Z])/g, " $1");
        const cleanNew = updatedTask.column.replace(/([A-Z])/g, " $1");
        mergedTask.activities.unshift({
          id: "act-col-" + Date.now(),
          username: activeUser,
          text: `moved task from "${cleanOld}" to "${cleanNew}"`,
          date: new Date().toISOString()
        });
      }

      tasks[index] = mergedTask;
      localStorage.setItem("ts_tasks", JSON.stringify(tasks));
      return mergedTask;
    }
    return null;
  },
  deleteTask: (taskId) => {
    const tasks = mockDB.getTasks();
    const filtered = tasks.filter((t) => t.id !== taskId);
    localStorage.setItem("ts_tasks", JSON.stringify(filtered));
    return true;
  },

  // Activities
  addActivity: (taskId, text) => {
    const tasks = mockDB.getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      const activeUser = mockDB.getActiveUser();
      const activity = {
        id: "act-" + Date.now(),
        username: activeUser,
        text,
        date: new Date().toISOString()
      };
      tasks[index].activities = tasks[index].activities || [];
      tasks[index].activities.unshift(activity);
      localStorage.setItem("ts_tasks", JSON.stringify(tasks));
      return activity;
    }
    return null;
  },

  // Comments
  addComment: (taskId, text) => {
    const tasks = mockDB.getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      const activeUser = mockDB.getActiveUser();
      const comment = {
        id: "comm-" + Date.now(),
        username: activeUser,
        text,
        date: new Date().toISOString()
      };
      tasks[index].comments = tasks[index].comments || [];
      tasks[index].comments.unshift(comment);
      localStorage.setItem("ts_tasks", JSON.stringify(tasks));

      // Also log comment in activities
      mockDB.addActivity(taskId, `added a comment: "${text.substring(0, 30)}${text.length > 30 ? "..." : ""}"`);

      return comment;
    }
    return null;
  },
  deleteComment: (taskId, commentId) => {
    const tasks = mockDB.getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      tasks[index].comments = tasks[index].comments.filter((c) => c.id !== commentId);
      localStorage.setItem("ts_tasks", JSON.stringify(tasks));
      return true;
    }
    return false;
  }
};
