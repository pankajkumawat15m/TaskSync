import { useMemo } from "react";
import {
  LayoutDashboard,
  CheckCircle,
  Clock,
  AlertTriangle,
  History,
  TrendingUp,
  Award,
} from "lucide-react";

const DashboardView = ({ tasks, members, projects, activeProject, activeAccentColor }) => {
  const strokeColor = {
    blue: "#3b82f6",
    purple: "#a855f7",
    emerald: "#10b981",
    rose: "#f43f5e",
    amber: "#f59e0b"
  }[activeAccentColor || "blue"] || "#3b82f6";

  const textColor = {
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    rose: "text-rose-600 dark:text-rose-400",
    amber: "text-amber-600 dark:text-amber-400"
  }[activeAccentColor || "blue"] || "text-blue-600";

  const gradientBar = {
    blue: "bg-gradient-to-r from-blue-600 to-cyan-500",
    purple: "bg-gradient-to-r from-purple-600 to-indigo-500",
    emerald: "bg-gradient-to-r from-emerald-600 to-teal-500",
    rose: "bg-gradient-to-r from-rose-600 to-pink-500",
    amber: "bg-gradient-to-r from-amber-600 to-orange-500"
  }[activeAccentColor || "blue"];
  // Find current project info
  const projectInfo = useMemo(() => {
    return projects.find((p) => p.id === activeProject) || { name: "Project Board", description: "" };
  }, [projects, activeProject]);

  // Statistics Computations
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.column === "done").length;
    const wip = tasks.filter((t) => t.column === "inProgress" || t.column === "inReview").length;

    // Overdue tasks
    const now = new Date();
    const overdue = tasks.filter((t) => {
      if (t.column === "done" || !t.deadline) return false;
      const due = new Date(t.deadline);
      return !isNaN(due.getTime()) && due.getTime() < now.getTime();
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, wip, overdue, completionRate };
  }, [tasks]);

  // Task Priority Distribution
  const priorityData = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => {
      if (counts[t.priority] !== undefined) {
        counts[t.priority]++;
      } else {
        counts.medium++;
      }
    });
    return counts;
  }, [tasks]);

  // Team Workload Distribution
  const teamWorkload = useMemo(() => {
    const workload = {};
    members.forEach((m) => {
      workload[m.name] = 0;
    });

    tasks.forEach((t) => {
      if (workload[t.username] !== undefined) {
        workload[t.username]++;
      }
    });

    return Object.entries(workload)
      .map(([name, count]) => {
        const member = members.find((m) => m.name === name) || { avatar: "👤", role: "Developer" };
        return { name, count, avatar: member.avatar, role: member.role };
      })
      .sort((a, b) => b.count - a.count);
  }, [tasks, members]);

  // Global Recent Activities
  const recentActivities = useMemo(() => {
    const all = [];
    tasks.forEach((t) => {
      if (t.activities) {
        t.activities.forEach((act) => {
          all.push({
            ...act,
            taskTitle: t.content,
            taskId: t.id,
          });
        });
      }
    });

    return all.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 25);
  }, [tasks]);

  return (
    <div className="flex-grow bg-slate-50 dark:bg-gray-900 overflow-y-auto p-6 space-y-6 scrollbar-thin transition-colors duration-250">
      {/* Project Overview Banner */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-gradient-to-br from-white via-slate-100 to-blue-50/20 dark:from-gray-950 dark:via-gray-950 dark:to-blue-950/40 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl select-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className={textColor} size={24} />
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 dark:from-white dark:via-gray-100 dark:to-blue-300">
              {projectInfo.name}
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-medium leading-relaxed max-w-xl">
            {projectInfo.description || "Track high-level sprint cycles and workload balance."}
          </p>
        </div>

        {/* Dynamic Completion Rate Ring */}
        <div className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800/80 px-4 py-3 rounded-xl">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle cx="24" cy="24" r="16" className="stroke-slate-100 dark:stroke-gray-800" strokeWidth="3" fill="transparent" />
            <circle
              cx="24"
              cy="24"
              r="16"
              stroke={strokeColor}
              strokeWidth="3.5"
              fill="transparent"
              strokeDasharray="100.48"
              strokeDashoffset={100.48 - (100.48 * stats.completionRate) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
              Global Completion
            </span>
            <span className={`text-lg font-black ${textColor}`}>{stats.completionRate}% Done</span>
          </div>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        {/* Total Tasks */}
        <div className="p-4 bg-white dark:bg-gray-950/80 border border-slate-200 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-lg hover:border-gray-300 dark:hover:border-gray-700/80 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
              Total Board Items
            </span>
            <span className="text-2xl font-black text-gray-800 dark:text-gray-100">{stats.total}</span>
          </div>
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <LayoutDashboard size={20} />
          </div>
        </div>

        {/* Completed */}
        <div className="p-4 bg-white dark:bg-gray-950/80 border border-slate-200 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-lg hover:border-gray-300 dark:hover:border-gray-700/80 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
              Completed Tasks
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.completed}</span>
          </div>
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle size={20} />
          </div>
        </div>

        {/* Active WIP */}
        <div className="p-4 bg-white dark:bg-gray-950/80 border border-slate-200 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-lg hover:border-gray-300 dark:hover:border-gray-700/80 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
              Active WIP Sprint
            </span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.wip}</span>
          </div>
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
            <Clock size={20} />
          </div>
        </div>

        {/* Overdue */}
        <div className="p-4 bg-white dark:bg-gray-950/80 border border-slate-200 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-lg hover:border-gray-300 dark:hover:border-gray-700/80 transition duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
              Overdue / At Risk
            </span>
            <span className="text-2xl font-black text-red-600 dark:text-red-500">{stats.overdue}</span>
          </div>
          <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Dynamic Analytics */}
        <div className="xl:col-span-2 space-y-6 flex flex-col">
          {/* Workload */}
          <div className="p-6 bg-white dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-2xl flex-grow shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-5 flex items-center gap-2 select-none">
              <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
              <span>Sprint Workload Allocation</span>
            </h3>

            <div className="space-y-4">
              {teamWorkload.map((user) => {
                const maxTasks = stats.total || 1;
                const ratioPercent = Math.round((user.count / maxTasks) * 100);

                return (
                  <div key={user.name} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{user.avatar}</span>
                        <span className="text-gray-700 dark:text-gray-300 font-semibold">{user.name}</span>
                        <span className="text-[9px] bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded font-normal">
                          {user.role}
                        </span>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">{user.count} tasks ({ratioPercent}%)</span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 h-3 rounded-full overflow-hidden">
                      <div
                        className={`${gradientBar} h-full rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${ratioPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {teamWorkload.length === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-6">No members assigned to task loads.</p>
              )}
            </div>
          </div>

          {/* Severity Spread */}
          <div className="p-6 bg-white dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl select-none">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-5 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
              <span>Severity Spread Distribution</span>
            </h3>

            <div className="grid grid-cols-3 gap-4">
              {/* High */}
              <div className="p-3 bg-red-500/5 border border-red-200 dark:border-red-500/10 rounded-xl text-center">
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 block uppercase tracking-wider mb-1">
                  High Risk
                </span>
                <span className="text-xl font-black text-red-500">{priorityData.high}</span>
                <span className="text-[9px] text-gray-400 dark:text-gray-600 block mt-0.5">Tasks pending</span>
              </div>

              {/* Medium */}
              <div className="p-3 bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-xl text-center">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase tracking-wider mb-1">
                  Medium
                </span>
                <span className="text-xl font-black text-amber-500">{priorityData.medium}</span>
                <span className="text-[9px] text-gray-400 dark:text-gray-600 block mt-0.5">Tasks pending</span>
              </div>

              {/* Low */}
              <div className="p-3 bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/10 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider mb-1">
                  Low Priority
                </span>
                <span className="text-xl font-black text-emerald-500">{priorityData.low}</span>
                <span className="text-[9px] text-gray-400 dark:text-gray-600 block mt-0.5">Tasks pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Widget */}
        <div className="p-6 bg-white dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl flex flex-col max-h-[500px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-5 flex items-center gap-2 select-none">
            <History size={16} className="text-cyan-600 dark:text-cyan-400" />
            <span>Workspace Activity Stream</span>
          </h3>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {recentActivities.map((act) => (
              <div key={act.id} className="text-xs leading-normal flex gap-2">
                <span className="text-blue-500 font-bold select-none">•</span>
                <div className="space-y-0.5">
                  <div className="text-gray-500 dark:text-gray-400 font-medium">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{act.username}</span>{" "}
                    <span>{act.text}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-gray-400 dark:text-gray-600 font-semibold select-none">
                    <span className="hover:text-blue-500 transition cursor-pointer">
                      {act.taskId}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(act.date).toLocaleDateString()}{" "}
                      {new Date(act.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {recentActivities.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-10 select-none">No active audit logs recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
