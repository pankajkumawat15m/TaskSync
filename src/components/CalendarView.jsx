import { useState, useMemo } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
const CalendarView = ({ tasks, onAddTask, onOpenTaskDetails, members, onOpenTaskDialog, activeAccentColor }) => {
  const iconColor = {
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    rose: "text-rose-600 dark:text-rose-400",
    amber: "text-amber-600 dark:text-amber-400"
  }[activeAccentColor || "blue"] || "text-blue-600";

  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Move Month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Generate Calendar Days
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Day of week of 1st day (0-6)
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate(); // Days in current month
    const totalDaysPrev = new Date(currentYear, currentMonth, 0).getDate(); // Days in previous month

    const days = [];

    // 1. Previous Month Padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDay = totalDaysPrev - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      days.push({
        day: prevDay,
        isPadding: true,
        dateStr: `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(prevDay).padStart(2, "0")}`
      });
    }

    // 2. Active Month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        isActiveMonth: true,
        dateStr: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
      });
    }

    // 3. Next Month Padding days
    const totalCells = 42; // standard 6 rows of 7 days
    const nextDaysNeeded = totalCells - days.length;
    for (let i = 1; i <= nextDaysNeeded; i++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      days.push({
        day: i,
        isPadding: true,
        dateStr: `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Tasks grouped by deadline date strings
  const tasksByDeadline = useMemo(() => {
    const mapping = {};
    tasks.forEach((task) => {
      if (task.deadline) {
        const dStr = task.deadline;
        if (!mapping[dStr]) mapping[dStr] = [];
        mapping[dStr].push(task);
      }
    });
    return mapping;
  }, [tasks]);

  const handleCellClick = (dateStr) => {
    onOpenTaskDialog("todo", dateStr);
  };

  const priorityColor = (priority) => {
    return {
      high: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-500/20",
      medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-500/20",
      low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-500/20"
    }[priority || "medium"];
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex-grow bg-slate-50 dark:bg-gray-900 overflow-y-auto p-6 space-y-6 flex flex-col h-screen scrollbar-thin transition-colors duration-250">
      {/* Calendar Header Nav */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800/80 p-5 rounded-2xl select-none">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <CalendarDays size={20} className={iconColor} />
            <span>Deadline Sprint Calendar</span>
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Monitor due dates. Click on any empty cell slot to create a task due on that date.
          </p>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <h3 className="text-base font-extrabold text-gray-700 dark:text-gray-300">
            {monthNames[currentMonth]} {currentYear}
          </h3>

          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 border border-slate-200 dark:border-gray-800 hover:border-slate-350 dark:hover:border-gray-700 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400 hover:text-black hover:dark:text-white rounded-lg transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 border border-slate-200 dark:border-gray-800 hover:border-slate-350 dark:hover:border-gray-700 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400 hover:text-black hover:dark:text-white rounded-lg transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Monthly Grid */}
      <div className="flex-grow bg-white dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[500px]">
        {/* Weekdays indicator row */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-950 text-center font-bold text-xs text-gray-500 dark:text-gray-400 py-3 select-none">
          {weekdays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 flex-grow divide-x divide-y divide-slate-200/60 dark:divide-gray-800 select-none">
          {calendarDays.map((cell, index) => {
            const dayTasks = tasksByDeadline[cell.dateStr] || [];
            const isToday = cell.dateStr === new Date().toISOString().split("T")[0];

            return (
              <div
                key={index}
                className={`min-h-[90px] p-2 flex flex-col gap-1.5 transition ${
                  cell.isPadding ? "bg-slate-50/50 dark:bg-gray-900/10 text-gray-300 dark:text-gray-600 opacity-40" : "bg-white dark:bg-gray-950/20"
                } ${isToday ? "ring-1 ring-blue-500/50 bg-blue-50/20 dark:bg-blue-950/5" : ""}`}
              >
                {/* Cell Number Header */}
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-bold ${isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}>
                    {cell.day}
                  </span>

                  {/* Quick Add icon */}
                  {!cell.isPadding && (
                    <button
                      onClick={() => handleCellClick(cell.dateStr)}
                      className="opacity-0 hover:opacity-100 p-0.5 text-gray-400 dark:text-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition"
                      title="Schedule Task"
                    >
                      <Plus size={12} />
                    </button>
                  )}
                </div>

                {/* Day's tasks tags container */}
                <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[85px] pr-0.5 scrollbar-none">
                  {dayTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTaskDetails(t);
                      }}
                      className={`px-1.5 py-1 rounded text-[10px] font-bold truncate cursor-pointer transition ${priorityColor(
                        t.priority
                      )}`}
                      title={t.content}
                    >
                      {t.content}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CalendarView;
