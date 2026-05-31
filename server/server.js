const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Pool Connection Settings
// Attempts to connect using standard system environment variables or fallbacks
const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "tasksync",
  port: parseInt(process.env.PGPORT || "5432"),
  connectionTimeoutMillis: 3000,
});

let usePostgres = false;
const fallbackDbPath = path.join(__dirname, "db_fallback.json");

// Default relational database seed records
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
  }
];

const DEFAULT_SUBTASKS = [
  { id: "sub-1-1", taskId: "task-1", content: "Integrate DndContext and SortableContext", completed: true },
  { id: "sub-1-2", taskId: "task-1", content: "Implement custom active drag overlays", completed: false },
  { id: "sub-2-1", taskId: "task-2", content: "Design glowing metric cards", completed: false },
  { id: "sub-2-2", taskId: "task-2", content: "Create dynamic SVG distribution pie chart", completed: false }
];

const DEFAULT_COMMENTS = [
  { id: "comm-1-1", taskId: "task-1", username: "Ananya", text: "I've uploaded the visual drag designs to the drive!", date: "2026-05-28T10:14:00.000Z" },
  { id: "comm-1-2", taskId: "task-1", username: "Aarav", text: "Perfect, matching the glassmorphic styling now.", date: "2026-05-29T14:22:00.000Z" }
];

const DEFAULT_ACTIVITIES = [
  { id: "act-1-1", taskId: "task-1", username: "Aarav", text: "created this task", date: "2026-05-20T09:00:00.000Z" },
  { id: "act-1-2", taskId: "task-1", username: "Diya", text: "changed priority to High", date: "2026-05-21T11:30:00.000Z" },
  { id: "act-2-1", taskId: "task-2", username: "Diya", text: "created this task", date: "2026-05-24T14:15:00.000Z" }
];

const DEFAULT_COLUMNS = {
  "proj-1": { todo: [], inProgress: [], inReview: [], done: [] },
  "proj-2": { todo: [], inProgress: [], done: [] },
  "proj-3": { todo: [], inProgress: [], done: [] }
};

// Check PostgreSQL Connectivity and Setup Tables
const initDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log("🟢 Successfully connected to PostgreSQL Database Server!");
    usePostgres = true;
    client.release();

    // Create Tables SQL Query
    const createTablesSql = `
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        color VARCHAR(50) DEFAULT 'blue'
      );

      CREATE TABLE IF NOT EXISTS members (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(100),
        avatar VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(100) PRIMARY KEY,
        project_id VARCHAR(100) REFERENCES projects(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        description TEXT,
        priority VARCHAR(50) DEFAULT 'medium',
        column_state VARCHAR(100) DEFAULT 'todo',
        date VARCHAR(50),
        deadline VARCHAR(50),
        username VARCHAR(100),
        time_spent VARCHAR(50) DEFAULT '0h',
        time_estimate VARCHAR(50) DEFAULT '4h'
      );

      CREATE TABLE IF NOT EXISTS subtasks (
        id VARCHAR(100) PRIMARY KEY,
        task_id VARCHAR(100) REFERENCES tasks(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        completed BOOLEAN DEFAULT false
      );

      CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(100) PRIMARY KEY,
        task_id VARCHAR(100) REFERENCES tasks(id) ON DELETE CASCADE,
        username VARCHAR(100) NOT NULL,
        text TEXT NOT NULL,
        date VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS activities (
        id VARCHAR(100) PRIMARY KEY,
        task_id VARCHAR(100) REFERENCES tasks(id) ON DELETE CASCADE,
        username VARCHAR(100) NOT NULL,
        text TEXT NOT NULL,
        date VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS columns_config (
        project_id VARCHAR(100) PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
        columns_data TEXT NOT NULL
      );
    `;

    await pool.query(createTablesSql);
    console.log("📋 Relational SQL Schema tables verified/created successfully.");

    // Seed tables if empty
    const projCheck = await pool.query("SELECT COUNT(*) FROM projects");
    if (parseInt(projCheck.rows[0].count) === 0) {
      console.log("🌱 Database is empty! Triggering automated data seeding...");
      
      // Projects Seed
      for (const p of DEFAULT_PROJECTS) {
        await pool.query("INSERT INTO projects (id, name, description, color) VALUES ($1, $2, $3, $4)", [p.id, p.name, p.description, p.color || "blue"]);
      }

      // Members Seed
      for (const m of DEFAULT_MEMBERS) {
        await pool.query("INSERT INTO members (id, name, role, avatar) VALUES ($1, $2, $3, $4)", [m.id, m.name, m.role, m.avatar]);
      }

      // Tasks Seed
      for (const t of DEFAULT_TASKS) {
        await pool.query(
          "INSERT INTO tasks (id, project_id, content, description, priority, column_state, date, deadline, username, time_spent, time_estimate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
          [t.id, t.projectId, t.content, t.description, t.priority, t.column, t.date, t.deadline, t.username, t.timeSpent, t.timeEstimate]
        );
      }

      // Subtasks Seed
      for (const s of DEFAULT_SUBTASKS) {
        await pool.query("INSERT INTO subtasks (id, task_id, content, completed) VALUES ($1, $2, $3, $4)", [s.id, s.taskId, s.content, s.completed]);
      }

      // Comments Seed
      for (const c of DEFAULT_COMMENTS) {
        await pool.query("INSERT INTO comments (id, task_id, username, text, date) VALUES ($1, $2, $3, $4, $5)", [c.id, c.taskId, c.username, c.text, c.date]);
      }

      // Activities Seed
      for (const a of DEFAULT_ACTIVITIES) {
        await pool.query("INSERT INTO activities (id, task_id, username, text, date) VALUES ($1, $2, $3, $4, $5)", [a.id, a.taskId, a.username, a.text, a.date]);
      }

      // Columns Config Seed
      for (const [pId, cols] of Object.entries(DEFAULT_COLUMNS)) {
        await pool.query("INSERT INTO columns_config (project_id, columns_data) VALUES ($1, $2)", [pId, JSON.stringify(cols)]);
      }

      console.log("🌱 Database successfully seeded with 🚀 TaskSync Enterprise Sprint logs!");
    }

  } catch (error) {
    console.error("⚠️ PostgreSQL Connection failed! Error details:", error.message);
    console.log("🔌 Activating zero-config resilient Local JSON File database fallback...");
    usePostgres = false;
    setupFallbackDB();
  }
};

// Resilient Fallback DB file setup (if PostgreSQL is not active)
const setupFallbackDB = () => {
  if (!fs.existsSync(fallbackDbPath)) {
    const seed = {
      projects: DEFAULT_PROJECTS,
      members: DEFAULT_MEMBERS,
      tasks: DEFAULT_TASKS.map((t) => ({
        ...t,
        subtasks: DEFAULT_SUBTASKS.filter((s) => s.taskId === t.id),
        comments: DEFAULT_COMMENTS.filter((c) => c.taskId === t.id),
        activities: DEFAULT_ACTIVITIES.filter((a) => a.taskId === t.id),
      })),
      columns: DEFAULT_COLUMNS,
    };
    fs.writeFileSync(fallbackDbPath, JSON.stringify(seed, null, 2));
    console.log("💾 Fallback DB seeded successfully in server/db_fallback.json.");
  }
};

const getFallbackData = () => {
  return JSON.parse(fs.readFileSync(fallbackDbPath, "utf8"));
};

const saveFallbackData = (data) => {
  fs.writeFileSync(fallbackDbPath, JSON.stringify(data, null, 2));
};

initDatabase();

// --- REST API ENDPOINTS ---

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: usePostgres ? "postgresql" : "fallback-json" });
});

// Reset
app.post("/api/reset", async (req, res) => {
  if (usePostgres) {
    try {
      await pool.query("TRUNCATE activities, comments, subtasks, tasks, members, columns_config, projects CASCADE");
      // Seed again
      await initDatabase();
      return res.json({ status: "success", message: "Database reset to default seed data" });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    fs.unlinkSync(fallbackDbPath);
    setupFallbackDB();
    res.json({ status: "success", message: "Fallback DB reset to default seed data" });
  }
});

// Get Projects
app.get("/api/projects", async (req, res) => {
  if (usePostgres) {
    try {
      const result = await pool.query("SELECT * FROM projects");
      res.json(result.rows);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    res.json(getFallbackData().projects);
  }
});

// Add Project
app.post("/api/projects", async (req, res) => {
  const { name, description, color } = req.body;
  const id = "proj-" + Date.now();
  const projColor = color || "blue";

  if (usePostgres) {
    try {
      await pool.query("INSERT INTO projects (id, name, description, color) VALUES ($1, $2, $3, $4)", [id, name, description, projColor]);
      // Default Columns
      const defaultCols = { todo: [], inProgress: [], done: [] };
      await pool.query("INSERT INTO columns_config (project_id, columns_data) VALUES ($1, $2)", [id, JSON.stringify(defaultCols)]);
      res.json({ id, name, description, color: projColor });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    const data = getFallbackData();
    const newProj = { id, name, description, color: projColor };
    data.projects.push(newProj);
    data.columns[id] = { todo: [], inProgress: [], done: [] };
    saveFallbackData(data);
    res.json(newProj);
  }
});

// Delete Project
app.delete("/api/projects/:projectId", async (req, res) => {
  const { projectId } = req.params;

  if (usePostgres) {
    try {
      await pool.query("DELETE FROM projects WHERE id = $1", [projectId]);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    const data = getFallbackData();
    data.projects = data.projects.filter((p) => p.id !== projectId);
    // Delete columns config
    delete data.columns[projectId];
    // Delete tasks belonging to project
    data.tasks = data.tasks.filter((t) => t.projectId !== projectId);
    saveFallbackData(data);
    res.json({ status: "success" });
  }
});

// Get Columns for Project
app.get("/api/projects/:projectId/columns", async (req, res) => {
  const { projectId } = req.params;

  if (usePostgres) {
    try {
      const result = await pool.query("SELECT columns_data FROM columns_config WHERE project_id = $1", [projectId]);
      if (result.rows.length > 0) {
        res.json(JSON.parse(result.rows[0].columns_data));
      } else {
        const defaultCols = { todo: [], inProgress: [], done: [] };
        res.json(defaultCols);
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    const cols = getFallbackData().columns[projectId] || { todo: [], inProgress: [], done: [] };
    res.json(cols);
  }
});

// Save Columns for Project
app.post("/api/projects/:projectId/columns", async (req, res) => {
  const { projectId } = req.params;
  const { columns } = req.body;

  if (usePostgres) {
    try {
      await pool.query(
        "INSERT INTO columns_config (project_id, columns_data) VALUES ($1, $2) ON CONFLICT (project_id) DO UPDATE SET columns_data = $2",
        [projectId, JSON.stringify(columns)]
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    const data = getFallbackData();
    data.columns[projectId] = columns;
    saveFallbackData(data);
    res.json({ status: "success" });
  }
});

// Get Members
app.get("/api/members", async (req, res) => {
  if (usePostgres) {
    try {
      const result = await pool.query("SELECT * FROM members");
      res.json(result.rows);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    res.json(getFallbackData().members);
  }
});

// Add Member
app.post("/api/members", async (req, res) => {
  const { name, role, avatar } = req.body;
  const id = "mem-" + Date.now();

  if (usePostgres) {
    try {
      await pool.query("INSERT INTO members (id, name, role, avatar) VALUES ($1, $2, $3, $4)", [id, name, role, avatar || "👤"]);
      res.json({ id, name, role, avatar });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    const data = getFallbackData();
    const newMember = { id, name, role, avatar: avatar || "👤" };
    data.members.push(newMember);
    saveFallbackData(data);
    res.json(newMember);
  }
});

// Get Tasks for Project
app.get("/api/projects/:projectId/tasks", async (req, res) => {
  const { projectId } = req.params;

  if (usePostgres) {
    try {
      const result = await pool.query("SELECT * FROM tasks WHERE project_id = $1", [projectId]);
      const tasks = [];

      for (const row of result.rows) {
        const subtasks = await pool.query("SELECT * FROM subtasks WHERE task_id = $1", [row.id]);
        const comments = await pool.query("SELECT * FROM comments WHERE task_id = $1 ORDER BY date DESC", [row.id]);
        const activities = await pool.query("SELECT * FROM activities WHERE task_id = $1 ORDER BY date DESC", [row.id]);

        tasks.push({
          id: row.id,
          projectId: row.project_id,
          content: row.content,
          description: row.description,
          priority: row.priority,
          column: row.column_state,
          date: row.date,
          deadline: row.deadline,
          username: row.username,
          timeSpent: row.time_spent,
          timeEstimate: row.time_estimate,
          subtasks: subtasks.rows,
          comments: comments.rows,
          activities: activities.rows,
        });
      }
      res.json(tasks);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    const tasks = getFallbackData().tasks.filter((t) => t.projectId === projectId);
    res.json(tasks);
  }
});

// Add Task
app.post("/api/tasks", async (req, res) => {
  const t = req.body;
  const taskId = "task-" + Date.now();
  const createdDate = t.date || new Date().toISOString().split("T")[0];

  const firstActivity = {
    id: "act-" + Date.now(),
    username: t.username || "Aarav",
    text: "created this task",
    date: new Date().toISOString()
  };

  if (usePostgres) {
    try {
      await pool.query(
        "INSERT INTO tasks (id, project_id, content, description, priority, column_state, date, deadline, username, time_spent, time_estimate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        [taskId, t.projectId, t.content, t.description, t.priority || "medium", t.column || "todo", createdDate, t.deadline, t.username, "0h", t.timeEstimate || "4h"]
      );

      // Save first activity
      await pool.query("INSERT INTO activities (id, task_id, username, text, date) VALUES ($1, $2, $3, $4, $5)", [
        firstActivity.id,
        taskId,
        firstActivity.username,
        firstActivity.text,
        firstActivity.date
      ]);

      res.json({
        id: taskId,
        projectId: t.projectId,
        content: t.content,
        description: t.description,
        priority: t.priority || "medium",
        column: t.column || "todo",
        date: createdDate,
        deadline: t.deadline,
        username: t.username,
        timeSpent: "0h",
        timeEstimate: t.timeEstimate || "4h",
        subtasks: [],
        comments: [],
        activities: [firstActivity]
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    const data = getFallbackData();
    const newTask = {
      id: taskId,
      projectId: t.projectId,
      content: t.content,
      description: t.description,
      priority: t.priority || "medium",
      column: t.column || "todo",
      date: createdDate,
      deadline: t.deadline,
      username: t.username,
      timeSpent: "0h",
      timeEstimate: t.timeEstimate || "4h",
      subtasks: [],
      comments: [],
      activities: [firstActivity]
    };
    data.tasks.push(newTask);
    saveFallbackData(data);
    res.json(newTask);
  }
});

// Update Task
app.put("/api/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const t = req.body;

  if (usePostgres) {
    try {
      // Get previous state to check changes
      const prevResult = await pool.query("SELECT * FROM tasks WHERE id = $1", [taskId]);
      if (prevResult.rows.length === 0) return res.status(404).json({ error: "Task not found" });
      const prev = prevResult.rows[0];

      await pool.query(
        "UPDATE tasks SET content = $1, description = $2, priority = $3, column_state = $4, deadline = $5, username = $6, time_spent = $7, time_estimate = $8 WHERE id = $9",
        [t.content, t.description, t.priority, t.column, t.deadline, t.username, t.timeSpent, t.timeEstimate, taskId]
      );

      // Check column changes for logging
      if (prev.column_state !== t.column) {
        const cleanOld = prev.column_state.replace(/([A-Z])/g, " $1");
        const cleanNew = t.column.replace(/([A-Z])/g, " $1");
        await pool.query("INSERT INTO activities (id, task_id, username, text, date) VALUES ($1, $2, $3, $4, $5)", [
          "act-col-" + Date.now(),
          taskId,
          t.username || "Aarav",
          `moved task from "${cleanOld}" to "${cleanNew}"`,
          new Date().toISOString()
        ]);
      }

      // Sync subtasks
      if (t.subtasks) {
        // Delete old subtasks
        await pool.query("DELETE FROM subtasks WHERE task_id = $1", [taskId]);
        for (const s of t.subtasks) {
          await pool.query("INSERT INTO subtasks (id, task_id, content, completed) VALUES ($1, $2, $3, $4)", [
            s.id,
            taskId,
            s.content,
            s.completed
          ]);
        }
      }

      // Return fully merged response
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    const data = getFallbackData();
    const index = data.tasks.findIndex((tk) => tk.id === taskId);
    if (index !== -1) {
      const prev = data.tasks[index];
      const merged = {
        ...prev,
        ...t,
        subtasks: t.subtasks || prev.subtasks || [],
        comments: t.comments || prev.comments || [],
        activities: t.activities || prev.activities || []
      };

      if (prev.column !== t.column) {
        const cleanOld = prev.column.replace(/([A-Z])/g, " $1");
        const cleanNew = t.column.replace(/([A-Z])/g, " $1");
        merged.activities.unshift({
          id: "act-col-" + Date.now(),
          username: t.username || "Aarav",
          text: `moved task from "${cleanOld}" to "${cleanNew}"`,
          date: new Date().toISOString()
        });
      }

      data.tasks[index] = merged;
      saveFallbackData(data);
      res.json(merged);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  }
});

// Delete Task
app.delete("/api/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;

  if (usePostgres) {
    try {
      await pool.query("DELETE FROM tasks WHERE id = $1", [taskId]);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    const data = getFallbackData();
    data.tasks = data.tasks.filter((t) => t.id !== taskId);
    saveFallbackData(data);
    res.json({ status: "success" });
  }
});

// Add Comment
app.post("/api/tasks/:taskId/comments", async (req, res) => {
  const { taskId } = req.params;
  const { username, text } = req.body;
  const id = "comm-" + Date.now();
  const date = new Date().toISOString();

  if (usePostgres) {
    try {
      await pool.query("INSERT INTO comments (id, task_id, username, text, date) VALUES ($1, $2, $3, $4, $5)", [
        id,
        taskId,
        username,
        text,
        date
      ]);
      // Log comment in activities
      await pool.query("INSERT INTO activities (id, task_id, username, text, date) VALUES ($1, $2, $3, $4, $5)", [
        "act-comm-" + Date.now(),
        taskId,
        username,
        `added a comment: "${text.substring(0, 30)}${text.length > 30 ? "..." : ""}"`,
        date
      ]);
      res.json({ id, username, text, date });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    const data = getFallbackData();
    const index = data.tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      const comment = { id, username, text, date };
      data.tasks[index].comments = data.tasks[index].comments || [];
      data.tasks[index].comments.unshift(comment);

      data.tasks[index].activities = data.tasks[index].activities || [];
      data.tasks[index].activities.unshift({
        id: "act-comm-" + Date.now(),
        username,
        text: `added a comment: "${text.substring(0, 30)}${text.length > 30 ? "..." : ""}"`,
        date
      });

      saveFallbackData(data);
      res.json(comment);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  }
});

// Delete Comment
app.delete("/api/tasks/:taskId/comments/:commentId", async (req, res) => {
  const { taskId, commentId } = req.params;

  if (usePostgres) {
    try {
      await pool.query("DELETE FROM comments WHERE id = $1 AND task_id = $2", [commentId, taskId]);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    const data = getFallbackData();
    const index = data.tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      data.tasks[index].comments = data.tasks[index].comments.filter((c) => c.id !== commentId);
      saveFallbackData(data);
      res.json({ status: "success" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 TaskSync Enterprise SQL Express Server active on PORT: ${PORT}`);
  console.log(`🔗 REST API Root URL: http://localhost:${PORT}/api`);
  console.log(`======================================================\n`);
});
