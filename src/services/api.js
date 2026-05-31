import { mockDB } from "./db";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000/api";

const client = axios.create({
  baseURL: BACKEND_URL,
  timeout: 4000,
});

let serverActive = false;

const checkServer = async () => {
  try {
    const res = await client.get("/health");
    if (res.status === 200) {
      serverActive = true;
      return true;
    }
  } catch (e) {
    serverActive = false;
  }
  return false;
};

// Start background server check
checkServer();
setInterval(checkServer, 10000);

export const api = {
  // Config & Active items
  getAPIMode: () => mockDB.getAPIMode(),
  setAPIMode: (mode) => {
    mockDB.setAPIMode(mode);
    window.location.reload();
  },

  getActiveProject: () => mockDB.getActiveProject(),
  setActiveProject: (id) => mockDB.setActiveProject(id),

  getActiveUser: () => mockDB.getActiveUser(),
  setActiveUser: (username) => mockDB.setActiveUser(username),

  resetDB: async () => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        await client.post("/reset");
        return true;
      } catch (e) {
        console.warn("Backend reset failed, falling back to local reset");
      }
    }
    return mockDB.resetDB();
  },

  // Projects
  getProjects: async () => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        const res = await client.get("/projects");
        return res.data;
      } catch (e) {
        console.error("Backend getProjects failed, falling back to local DB", e);
        return mockDB.getProjects(); // Fixed critical bug: missing return statement
      }
    }
    return mockDB.getProjects();
  },

  addProject: async (name, description, color = "blue") => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        const res = await client.post("/projects", { name, description, color });
        return res.data;
      } catch (e) {
        console.error("Backend addProject failed, falling back to local DB", e);
        return mockDB.addProject(name, description, color); // Fixed critical bug: missing return statement
      }
    }
    return mockDB.addProject(name, description, color);
  },

  deleteProject: async (projectId) => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        await client.delete(`/projects/${projectId}`);
        return true;
      } catch (e) {
        console.error("Backend deleteProject failed, falling back to local DB", e);
        return mockDB.deleteProject(projectId);
      }
    }
    return mockDB.deleteProject(projectId);
  },

  // Columns per project
  getColumnsForProject: async (projectId) => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        const res = await client.get(`/projects/${projectId}/columns`);
        return res.data;
      } catch (e) {
        console.error("Backend getColumnsForProject failed, falling back to local DB", e);
        return mockDB.getColumnsForProject(projectId); // Fixed critical bug: missing return statement
      }
    }
    return mockDB.getColumnsForProject(projectId);
  },

  saveColumnsForProject: async (projectId, columnsData) => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        await client.post(`/projects/${projectId}/columns`, { columns: columnsData });
        return;
      } catch (e) {
        console.error("Backend saveColumnsForProject failed, falling back to local DB", e);
      }
    }
    mockDB.saveColumnsForProject(projectId, columnsData);
  },

  // Members
  getMembers: async () => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        const res = await client.get("/members");
        return res.data;
      } catch (e) {
        console.error("Backend getMembers failed, falling back to local DB", e);
        return mockDB.getMembers(); // Fixed critical bug: missing return statement
      }
    }
    return mockDB.getMembers();
  },

  addMember: async (name, role, avatar) => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        const res = await client.post("/members", { name, role, avatar });
        return res.data;
      } catch (e) {
        console.error("Backend addMember failed, falling back to local DB", e);
        return mockDB.addMember(name, role, avatar); // Fixed critical bug: missing return statement
      }
    }
    return mockDB.addMember(name, role, avatar);
  },

  // Tasks
  getTasksForProject: async (projectId) => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        const res = await client.get(`/projects/${projectId}/tasks`);
        return res.data;
      } catch (e) {
        console.error("Backend getTasksForProject failed, falling back to local DB", e);
        return mockDB.getTasksForProject(projectId); // Fixed critical bug: missing return statement
      }
    }
    return mockDB.getTasksForProject(projectId);
  },

  addTask: async (taskData) => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        const res = await client.post("/tasks", taskData);
        return res.data;
      } catch (e) {
        console.error("Backend addTask failed, falling back to local DB", e);
        return mockDB.addTask(taskData); // Fixed critical bug: missing return statement
      }
    }
    return mockDB.addTask(taskData);
  },

  updateTask: async (taskData) => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        const res = await client.put(`/tasks/${taskData.id}`, taskData);
        return res.data;
      } catch (e) {
        console.error("Backend updateTask failed, falling back to local DB", e);
        return mockDB.updateTask(taskData); // Fixed critical bug: missing return statement
      }
    }
    return mockDB.updateTask(taskData);
  },

  deleteTask: async (taskId) => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        await client.delete(`/tasks/${taskId}`);
        return true;
      } catch (e) {
        console.error("Backend deleteTask failed, falling back to local DB", e);
        return mockDB.deleteTask(taskId); // Fixed critical bug: missing return statement
      }
    }
    return mockDB.deleteTask(taskId);
  },

  // Comments
  addComment: async (taskId, text) => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        const res = await client.post(`/tasks/${taskId}/comments`, { text, username: mockDB.getActiveUser() });
        return res.data;
      } catch (e) {
        console.error("Backend addComment failed, falling back to local DB", e);
        return mockDB.addComment(taskId, text); // Fixed critical bug: missing return statement
      }
    }
    return mockDB.addComment(taskId, text);
  },

  deleteComment: async (taskId, commentId) => {
    const mode = mockDB.getAPIMode();
    if (mode === "server") {
      try {
        await client.delete(`/tasks/${taskId}/comments/${commentId}`);
        return true;
      } catch (e) {
        console.error("Backend deleteComment failed, falling back to local DB", e);
        return mockDB.deleteComment(taskId, commentId); // Fixed critical bug: missing return statement
      }
    }
    return mockDB.deleteComment(taskId, commentId);
  },

  isServerOnline: async () => {
    return await checkServer();
  }
};
