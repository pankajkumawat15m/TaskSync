import { useMemo } from "react";
import { Milestone, ChevronRight, AlertCircle } from "lucide-react";

const TimelineView = ({ tasks, onOpenTaskDetails, activeAccentColor }) => {
  const iconColor = {
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    rose: "text-rose-600 dark:text-rose-400",
    amber: "text-amber-600 dark:text-amber-400"
  }[activeAccentColor || "blue"] || "text-blue-600";

  // Timeline Window configuration: 30 days centered around today
  const timelineConfig = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7);

    const days = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return { startDate, days };
  }, []);

  // Filter out tasks without deadlines, and compute offset/spans
  const timelineTasks = useMemo(() => {
    const { startDate, days } = timelineConfig;
    const windowStartMs = startDate.getTime();
    const windowEndMs = days[days.length - 1].getTime() + 86400000; // End of last day

    return tasks
      .filter((task) => task.deadline)
      .map((task) => {
        const createdDate = task.date ? new Date(task.date) : new Date();
        const dueDate = new Date(task.deadline);

        let startMs = createdDate.getTime();
        let endMs = dueDate.getTime();

        if (startMs > endMs) {
          startMs = endMs - 86400000;
        }

        const startClamped = Math.max(startMs, windowStartMs);
        const endClamped = Math.min(endMs, windowEndMs);

        if (endMs < windowStartMs || startMs > windowEndMs) {
          return null;
        }

        const msPerDay = 86400000;
        const offsetDays = Math.floor((startClamped - windowStartMs) / msPerDay);
        const spanDays = Math.ceil((endClamped - startClamped) / msPerDay) || 1;

        return {
          ...task,
          startCol: offsetDays + 1,
          span: spanDays,
          startDateText: new Date(startMs).toLocaleDateString(),
          endDateText: new Date(endMs).toLocaleDateString(),
        };
      })
      .filter((t) => t !== null);
  }, [tasks, timelineConfig]);

  const priorityColor = (priority) => {
    return {
      high: "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30",
      medium: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30",
      low: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
    }[priority || "medium"];
  };

  const statusBadge = (colId) => {
    return {
      todo: "🔴",
      inProgress: "🔵",
      inReview: "🟣",
      done: "🟢"
    }[colId] || "⚪";
  };

  return (
    <div className="flex-grow bg-slate-50 dark:bg-gray-900 overflow-y-auto p-6 space-y-6 flex flex-col h-screen scrollbar-thin transition-colors duration-250">
      {/* Timeline Header Nav */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800/80 p-5 rounded-2xl select-none">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Milestone size={20} className={iconColor} />
            <span>Sprint Roadmap & Timeline</span>
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Visual Gantt chart representation. Track sprint overlap duration from task creation to due date.
          </p>
        </div>
      </header>

      {/* Gantt Shell */}
      <div className="flex-grow bg-white dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[450px]">
        {/* Days Header row */}
        <div className="flex border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-950 select-none">
          {/* Left spacer column for titles */}
          <div className="w-56 p-3 flex-shrink-0 font-bold text-xs text-gray-500 dark:text-gray-400 border-r border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-950">
            Sprint Objectives
          </div>

          {/* Timeline columns days */}
          <div className="flex-grow grid grid-cols-30 text-center font-bold text-[9px] text-gray-400 dark:text-gray-500 py-3 overflow-x-auto pr-1">
            {timelineConfig.days.map((date, idx) => {
              const isToday = date.toISOString().split("T")[0] === new Date().toISOString().split("T")[0];
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center border-r border-slate-200/40 dark:border-gray-800/40 ${
                    isToday ? "text-blue-600 dark:text-blue-400 font-black ring-1 ring-blue-500/25 bg-blue-50/20 dark:bg-blue-950/10" : ""
                  }`}
                  title={date.toLocaleDateString()}
                >
                  <span>{date.getDate()}</span>
                  <span className="text-[7px] text-gray-400 dark:text-gray-600 font-semibold leading-tight uppercase">
                    {date.toLocaleDateString([], { weekday: "short" }).substring(0, 1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rows container */}
        <div className="flex-grow overflow-y-auto divide-y divide-slate-100 dark:divide-gray-900 bg-white dark:bg-gray-950/20">
          {timelineTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => onOpenTaskDetails(t)}
              className="flex items-center hover:bg-slate-50/50 dark:hover:bg-gray-900/10 cursor-pointer transition select-none group h-14"
            >
              {/* Task Title panel */}
              <div className="w-56 p-3 h-full flex-shrink-0 border-r border-slate-200 dark:border-gray-800 font-semibold text-xs text-gray-600 dark:text-gray-300 group-hover:text-black group-hover:dark:text-white bg-slate-50/30 dark:bg-gray-950/30 transition flex items-center justify-between gap-1 max-w-xs overflow-hidden">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[10px]">{statusBadge(t.column)}</span>
                  <span className="truncate" title={t.content}>
                    {t.content}
                  </span>
                </div>
                <ChevronRight size={10} className="text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition" />
              </div>

              {/* Gantt Bar cell grid container */}
              <div className="flex-grow grid grid-cols-30 h-full relative items-center py-2 pr-1">
                {/* Horizontal Gantt line */}
                <div
                  style={{
                    gridColumnStart: t.startCol,
                    gridColumnEnd: `span ${t.span}`,
                  }}
                  className={`h-8 rounded-xl flex items-center justify-start px-3 shadow-sm transition-all duration-300 font-bold text-[9px] cursor-pointer ${priorityColor(
                    t.priority
                  )}`}
                  title={`${t.content} (From ${t.startDateText} to ${t.endDateText})`}
                >
                  <span className="truncate max-w-xs">{t.content}</span>
                </div>
              </div>
            </div>
          ))}

          {timelineTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500 font-semibold select-none text-center">
              <AlertCircle size={28} className="text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-xs">No deadlines scheduled. Configure deadlines to populate sprint roadmaps.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
