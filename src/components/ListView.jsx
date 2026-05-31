import { useState, useMemo } from "react";
import {
  ListTodo,
  Search,
  ArrowUpDown,
  Calendar,
  ChevronRight
} from "lucide-react";

const ListView = ({ tasks, members, onOpenTaskDetails, activeAccentColor }) => {
  const iconColor = {
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    rose: "text-rose-600 dark:text-rose-400",
    amber: "text-amber-600 dark:text-amber-400"
  }[activeAccentColor || "blue"] || "text-blue-600";
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("deadline");
  const [sortAsc, setSortAsc] = useState(true);

  // Sorting Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Group and Sort Tasks
  const processedTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const query = searchQuery.toLowerCase();
      return (
        task.content.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        task.id.toLowerCase().includes(query) ||
        task.username.toLowerCase().includes(query)
      );
    });

    return filtered.sort((a, b) => {
      let valA = a[sortField] || "";
      let valB = b[sortField] || "";

      if (sortField === "deadline" || sortField === "date") {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [tasks, searchQuery, sortField, sortAsc]);

  const priorityBadge = (priority) => {
    const meta = {
      high: "bg-red-500/10 text-red-500 dark:text-red-400 border-red-200 dark:border-red-500/20",
      medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
      low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
    }[priority || "medium"];

    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${meta}`}>
        {priority}
      </span>
    );
  };

  const statusBadge = (colId) => {
    const formatted = colId.replace(/([A-Z])/g, " $1");
    const meta = {
      todo: "bg-slate-100 text-gray-600 border-slate-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
      inProgress: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/25",
      inReview: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/25",
      done: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/25"
    }[colId] || "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";

    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold capitalize border ${meta}`}>
        {formatted}
      </span>
    );
  };

  return (
    <div className="flex-grow bg-slate-50 dark:bg-gray-900 overflow-y-auto p-6 space-y-6 flex flex-col h-screen scrollbar-thin transition-colors duration-250">
      {/* Search Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800/80 p-5 rounded-2xl select-none">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-950 dark:text-white">
            <ListTodo size={20} className={iconColor} />
            <span>Workspace List Spreadsheet</span>
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            High density tabular list with fast sorting and quick keyword filtering.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Type filter query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
          />
        </div>
      </header>

      {/* Spreadsheet List Panel */}
      <div className="flex-grow bg-white dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-0">
        <div className="flex-grow overflow-auto scrollbar-thin">
          <table className="w-full border-collapse text-left text-xs">
            {/* Headers */}
            <thead className="bg-slate-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold sticky top-0 z-10 select-none">
              <tr>
                <th
                  onClick={() => handleSort("id")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-900/60 hover:text-black dark:hover:text-white transition duration-150"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Task ID</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("content")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-900/60 hover:text-black dark:hover:text-white transition duration-150"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Title / Objective</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("column")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-900/60 hover:text-black dark:hover:text-white transition duration-150"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("priority")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-900/60 hover:text-black dark:hover:text-white transition duration-150"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Priority</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("username")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-900/60 hover:text-black dark:hover:text-white transition duration-150"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Assignee</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("deadline")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-900/60 hover:text-black dark:hover:text-white transition duration-150"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Due Date</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Action</th>
              </tr>
            </thead>

            {/* Rows */}
            <tbody className="divide-y divide-gray-150 dark:divide-gray-900 bg-white dark:bg-gray-950/20">
              {processedTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => onOpenTaskDetails(task)}
                  className="hover:bg-slate-50 dark:hover:bg-gray-900/40 cursor-pointer group transition duration-150"
                >
                  <td className="py-3 px-4 text-gray-400 dark:text-gray-500 font-extrabold uppercase select-all">
                    {task.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-200 group-hover:text-black group-hover:dark:text-white transition max-w-xs truncate">
                    {task.content}
                  </td>
                  <td className="py-3 px-4 select-none">
                    {statusBadge(task.column)}
                  </td>
                  <td className="py-3 px-4 select-none">
                    {priorityBadge(task.priority)}
                  </td>
                  <td className="py-3 px-4 select-none">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-bold">
                      <span>👤</span>
                      <span>{task.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 font-medium">
                    {task.deadline ? (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{new Date(task.deadline).toLocaleDateString()}</span>
                      </span>
                    ) : (
                      "No date"
                    )}
                  </td>
                  <td className="py-3 px-4 select-none">
                    <span className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 text-[11px] font-bold transition duration-200">
                      <span>Details</span>
                      <ChevronRight size={12} />
                    </span>
                  </td>
                </tr>
              ))}

              {processedTasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 dark:text-gray-500 font-semibold select-none">
                    No spreadsheet items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListView;
