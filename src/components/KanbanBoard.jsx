import { useState, useEffect, useCallback, useMemo } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
        // Ensure parsed data has the correct structure
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
    console.log("Columns updated:", columns);
    localStorage.setItem("kanban-board", JSON.stringify(columns));
  }, [columns]);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      const sourceColumn = Object.keys(columns).find((column) =>
        columns[column].some((task) => task.id === activeId)
      );
      const destColumn = Object.keys(columns).find((column) =>
        columns[column].some((task) => task.id === overId)
      );

      if (sourceColumn && destColumn) {
        if (sourceColumn === destColumn) {
          const newTasks = arrayMove(
            columns[sourceColumn],
            columns[sourceColumn].findIndex((task) => task.id === activeId),
            columns[sourceColumn].findIndex((task) => task.id === overId)
          );
          setColumns((prev) => ({ ...prev, [sourceColumn]: newTasks }));
        } else {
          const sourceTasks = columns[sourceColumn].filter(
            (task) => task.id !== activeId
          );
          const destTasks = [
            ...columns[destColumn],
            columns[sourceColumn].find((task) => task.id === activeId),
          ];
          setColumns((prev) => ({
            ...prev,
            [sourceColumn]: sourceTasks,
            [destColumn]: destTasks,
          }));
        }
      }
    },
    [columns]
  );

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

  const handleEditTask = useCallback(
    (task) => {
      const columnId = Object.keys(columns).find((column) =>
        columns[column].some((t) => t.id === task.id)
      );
      if (columnId) {
        setColumns((prev) => ({
          ...prev,
          [columnId]: prev[columnId].map((t) => (t.id === task.id ? task : t)),
        }));
        setEditingTask(null);
      }
    },
    [columns]
  );

  const handleDeleteTask = useCallback(
    (columnId, taskId) => {
      setColumns((prev) => ({
        ...prev,
        [columnId]: prev[columnId].filter((task) => task.id !== taskId),
      }));
      if (editingTask && editingTask.id === taskId) {
        setEditingTask(null);
      }
    },
    [editingTask]
  );

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
    <div className="p-6 bg-secondary-gray min-h-screen font-sans">
      {/* Enhanced Navbar with Cool Styling */}
      <nav className="flex justify-between items-center mb-8 p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 shadow-lg rounded-xl border border-gray-600 transform transition-all duration-300 hover:scale-102">
        <div className="flex items-center space-x-6">
          <img
            src={logo}
            alt="TaskSync Logo"
            className="h-16 w-auto transition-all duration-300 hover:rotate-6 hover:scale-110 shadow-md rounded-lg border-2 border-blue-500 bg-blue-900 p-1"
          />
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 hover:text-white transition-all duration-300">
            TaskSync
          </h1>
        </div>
        <div className="space-x-4">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsTaskDialogOpen(true);
              console.log("New Task clicked");
            }}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 px-6 py-2 rounded-full shadow-lg transform hover:scale-105"
          >
            New Task
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsAddColumnDialogOpen(true);
              console.log("Add Column clicked");
            }}
            className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 px-6 py-2 rounded-full shadow-md transform hover:scale-105"
          >
            Add Column
          </Button>
        </div>
      </nav>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div
          className="flex gap-6 overflow-x-auto pb-6"
          style={{ flexWrap: "nowrap" }}
        >
          {columnsArray.length > 0 ? (
            columnsArray.map(([columnId, tasks]) => (
              <KanbanColumn
                key={columnId}
                columnId={columnId}
                tasks={tasks}
                onDelete={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setColumnToDelete(columnId);
                  console.log("Delete Column clicked:", columnId);
                }}
                onAddTask={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsTaskDialogOpen(true);
                  setSelectedColumn(columnId);
                  console.log("Add Task clicked:", columnId);
                }}
                onEditTask={setEditingTask}
                onDeleteTask={handleDeleteTask}
              />
            ))
          ) : (
            <p className="text-gray-600 text-center py-6">
              No columns available. Add a column to start.
            </p>
          )}
        </div>
      </DndContext>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setSelectedColumn(null);
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
