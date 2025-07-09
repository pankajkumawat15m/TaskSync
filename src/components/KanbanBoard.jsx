import { useState, useEffect, useCallback, useMemo } from "react";
import KanbanColumn from "./KanbanColumn";
import TaskDialog from "./TaskDialog";
import ColumnDialog from "./ColumnDialog";
import DeleteColumnDialog from "./DeleteColumnDialog";
import { Button } from "./ui/Button";
import logo from "../assets/logotasksync.jpg";

const KanbanBoard = () => {
  const [columns, setColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("kanban-board");
      let initialColumns = { todo: [], inProgress: [], inReview: [], done: [] };

      if (saved) {
        initialColumns = JSON.parse(saved);
        if (!initialColumns || typeof initialColumns !== "object") {
          initialColumns = { todo: [], inProgress: [], inReview: [], done: [] };
        }
      }

      return Object.fromEntries(
        Object.entries(initialColumns).map(([key, tasks]) => [
          key,
          Array.isArray(tasks)
            ? tasks.map((task) => ({
                ...task,
                priority: task.priority || "medium",
                members: task.members || [],
                subtasks: task.subtasks || [],
                comments: task.comments || [],
                files: task.files || [],
                timeSpent: task.timeSpent || "0h 0m",
              }))
            : [],
        ])
      );
    } catch (error) {
      console.error("Error initializing state from localStorage:", error);
      return { todo: [], inProgress: [], inReview: [], done: [] };
    }
  });

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);

  useEffect(() => {
    localStorage.setItem("kanban-board", JSON.stringify(columns));
  }, [columns]);

  const handleAddTask = useCallback((task) => {
    if (!task.content.trim()) return;
    setColumns((prev) => ({
      ...prev,
      [task.column]: [
        ...(prev[task.column] || []),
        {
          id: Date.now().toString(),
          ...task,
          members: [],
          subtasks: [],
          comments: [],
          files: [],
          timeSpent: "0h 0m",
        },
      ],
    }));
    setIsTaskDialogOpen(false);
    setSelectedColumn(null);
  }, []);

  const handleEditTask = useCallback((task) => {
    const columnId = Object.keys(columns).find((column) =>
      columns[column].some((t) => t.id === task.id)
    );
    if (columnId) {
      setColumns((prev) => ({
        ...prev,
        [columnId]: prev[columnId].map((t) => (t.id === task.id ? task : t)),
      }));
      setEditingTask(null);
      setIsTaskDialogOpen(false);
    }
  }, [columns]);

  const handleDeleteTask = useCallback((columnId, taskId) => {
    setColumns((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((task) => task.id !== taskId),
    }));
    if (editingTask?.id === taskId) {
      setEditingTask(null);
    }
  }, [editingTask]);

  const handleDeleteColumn = useCallback(() => {
    if (columnToDelete) {
      setColumns((prev) => {
        const newColumns = { ...prev };
        delete newColumns[columnToDelete];
        return newColumns;
      });
      setColumnToDelete(null);
    }
  }, [columnToDelete]);

  const columnsArray = useMemo(() => Object.entries(columns), [columns]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-4 sm:p-6 md:p-8">
      <nav className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 p-4 bg-gray-950 rounded-xl shadow-xl border border-gray-800">
        <div className="flex items-center space-x-4 sm:space-x-6 mb-4 sm:mb-0">
          <img
            src={logo}
            alt="TaskSync Logo"
            className="h-12 w-auto sm:h-16 rounded-lg border-2 border-blue-500 bg-blue-900 p-1 transition-transform duration-300 ease-in-out hover:scale-110"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 hover:text-cyan-400 transition-colors duration-300">
            TaskSync
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Button
            onClick={() => setIsTaskDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full shadow-md transition-all hover:from-cyan-500 hover:to-blue-600 hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
          >
            + New Task
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsAddColumnDialogOpen(true)}
            className="border-2 border-blue-500 text-blue-400 px-4 py-2 rounded-full hover:bg-blue-900/30 hover:text-white transition-all w-full sm:w-auto text-sm sm:text-base"
          >
            + Add Column
          </Button>
        </div>
      </nav>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 overflow-x-auto pb-6 items-start no-scrollbar snap-x snap-mandatory">
        {columnsArray.length > 0 ? (
          columnsArray.map(([columnId, tasks]) => (
            <KanbanColumn
              key={columnId}
              columnId={columnId}
              tasks={tasks}
              onDelete={() => setColumnToDelete(columnId)}
              onAddTask={() => {
                setIsTaskDialogOpen(true);
                setSelectedColumn(columnId);
              }}
              onEditTask={setEditingTask}
              onDeleteTask={handleDeleteTask}
              onOpenTaskDialog={() => setIsTaskDialogOpen(true)}
            />
          ))
        ) : (
          <p className="text-gray-300 text-center py-6 w-full text-sm sm:text-base">
            No columns yet. Add one!
          </p>
        )}
      </div>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setSelectedColumn(null);
          setEditingTask(null);
        }}
        columns={columns}
        onAddTask={handleAddTask}
        editingTask={editingTask}
        onEditTask={handleEditTask}
        selectedColumn={selectedColumn}
      />

      <ColumnDialog
        isOpen={isAddColumnDialogOpen}
        onClose={() => setIsAddColumnDialogOpen(false)}
        onAddColumn={(name) => {
          const columnKey = name.toLowerCase().replace(/\s+/g, "");
          setColumns((prev) => ({ ...prev, [columnKey]: [] }));
        }}
      />

      <DeleteColumnDialog
        isOpen={!!columnToDelete}
        onClose={() => setColumnToDelete(null)}
        columnName={columnToDelete?.replace(/([A-Z])/g, " $1")}
        onDelete={handleDeleteColumn}
      />
    </div>
  );
};

export default KanbanBoard;