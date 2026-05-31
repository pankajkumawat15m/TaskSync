import { useState, useEffect, useMemo, useCallback } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  closestCorners,
  DragOverlay
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import Task from "./Task";
import ColumnDialog from "./ColumnDialog";
import DeleteColumnDialog from "./DeleteColumnDialog";
import { Button } from "./ui/Button";
import { api } from "../services/api";
import { Search, Filter, KanbanSquare, SlidersHorizontal, Users, Plus } from "lucide-react";

const KanbanBoard = ({
  tasks,
  members,
  activeProject,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onOpenTaskDetails,
  onAddMember,
  onOpenTaskDialog,
  onOpenMemberDialog
}) => {
  const [columnsList, setColumnsList] = useState([]);
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  // Drag State for Visual Overlays
  const [activeDragTask, setActiveDragTask] = useState(null);

  // Load project column configurations
  const loadColumns = useCallback(async () => {
    if (activeProject) {
      const cols = await api.getColumnsForProject(activeProject);
      setColumnsList(Object.keys(cols));
    }
  }, [activeProject]);

  useEffect(() => {
    loadColumns();
  }, [loadColumns]);

  // Group and Filter Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === "all" || task.username === assigneeFilter;
      
      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchQuery, priorityFilter, assigneeFilter]);

  const tasksByColumn = useMemo(() => {
    const grouped = {};
    columnsList.forEach((col) => {
      grouped[col] = [];
    });
    
    filteredTasks.forEach((task) => {
      if (grouped[task.column] !== undefined) {
        grouped[task.column].push(task);
      } else if (columnsList.length > 0) {
        const fallbackCol = columnsList[0];
        grouped[fallbackCol] = grouped[fallbackCol] || [];
        grouped[fallbackCol].push(task);
      }
    });
    return grouped;
  }, [filteredTasks, columnsList]);

  // DND Kit Configs
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6, // Prevents drag activation when clicking to edit or open details
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveDragTask(task);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveDragTask(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if dragging column
    if (active.data.current?.type === "Column") {
      if (activeId === overId) return;
      const oldIndex = columnsList.indexOf(activeId);
      const newIndex = columnsList.indexOf(overId);
      const reorderedCols = arrayMove(columnsList, oldIndex, newIndex);
      setColumnsList(reorderedCols);
      
      const colDataObj = {};
      reorderedCols.forEach((col) => {
        colDataObj[col] = [];
      });
      await api.saveColumnsForProject(activeProject, colDataObj);
      return;
    }

    const draggedTask = tasks.find((t) => t.id === activeId);
    if (!draggedTask) return;

    // Case 1: Dragged over a column dropzone
    if (over.data.current?.type === "Column") {
      const destinationCol = overId;
      if (draggedTask.column !== destinationCol) {
        onUpdateTask({ ...draggedTask, column: destinationCol });
      }
      return;
    }

    // Case 2: Dragged over another task card
    const targetTask = tasks.find((t) => t.id === overId);
    if (targetTask) {
      const destinationCol = targetTask.column;
      if (draggedTask.column !== destinationCol) {
        onUpdateTask({ ...draggedTask, column: destinationCol });
      }
    }
  };

  const handleAddColumn = async (name) => {
    const colKey = name.toLowerCase().replace(/\s+/g, "");
    if (columnsList.includes(colKey)) return;
    
    const updatedCols = [...columnsList, colKey];
    setColumnsList(updatedCols);

    const colDataObj = {};
    updatedCols.forEach((col) => {
      colDataObj[col] = [];
    });
    await api.saveColumnsForProject(activeProject, colDataObj);
  };

  const handleDeleteColumn = async () => {
    if (columnToDelete) {
      const updatedCols = columnsList.filter((c) => c !== columnToDelete);
      setColumnsList(updatedCols);
      
      const colDataObj = {};
      updatedCols.forEach((col) => {
        colDataObj[col] = [];
      });
      await api.saveColumnsForProject(activeProject, colDataObj);

      // Re-assign tasks inside deleted column to the first column if any exist
      const tasksInDeletedCol = tasks.filter((t) => t.column === columnToDelete);
      if (tasksInDeletedCol.length > 0 && updatedCols.length > 0) {
        const fallbackCol = updatedCols[0];
        tasksInDeletedCol.forEach((task) => {
          onUpdateTask({ ...task, column: fallbackCol });
        });
      }
      
      setColumnToDelete(null);
    }
  };

  const handleRenameColumn = async (oldColId, newColName) => {
    const cleanId = newColName.trim().replace(/\s+/g, "");
    if (!cleanId || cleanId === oldColId) return;

    if (columnsList.includes(cleanId)) {
      alert("A column with that name already exists!");
      return;
    }

    // 1. Reorder / update column keys array
    const updatedCols = columnsList.map((col) => (col === oldColId ? cleanId : col));
    setColumnsList(updatedCols);

    // 2. Build columns dictionary for database configuration
    const colDataObj = {};
    updatedCols.forEach((col) => {
      colDataObj[col] = [];
    });
    await api.saveColumnsForProject(activeProject, colDataObj);

    // 3. Update tasks' column fields to stay in sync
    const tasksInOldCol = tasks.filter((t) => t.column === oldColId);
    for (const task of tasksInOldCol) {
      await onUpdateTask({ ...task, column: cleanId });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden select-none transition-colors duration-250">
      {/* Board Utility Header */}
      <header className="px-6 py-4 border-b border-gray-200 dark:border-gray-800/80 bg-white/40 dark:bg-gray-950/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <KanbanSquare size={20} className="text-blue-600 dark:text-blue-400" />
            <span>Kanban Workspace</span>
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Manage your project tasks in columns. Drag tasks to update status.
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-grow md:flex-grow-0 md:w-56">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            />
          </div>

          {/* Priority filter */}
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-2 py-1 text-xs">
            <Filter size={12} className="text-gray-400 dark:text-gray-500 mr-1.5" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent border-none text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">All Priorities</option>
              <option value="high" className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">🔴 High</option>
              <option value="medium" className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">🟡 Medium</option>
              <option value="low" className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">🟢 Low</option>
            </select>
          </div>

          {/* Member filter */}
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-2 py-1 text-xs">
            <SlidersHorizontal size={12} className="text-gray-400 dark:text-gray-500 mr-1.5" />
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="bg-transparent border-none text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer pr-1 mr-1"
            >
              <option value="all" className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">All Assignees</option>
              {members.map((m) => (
                <option key={m.id} value={m.name} className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
                  {m.name}
                </option>
              ))}
            </select>

            {/* Premium Add Member Button directly inside filter group */}
            <button
              onClick={onOpenMemberDialog}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 p-0.5"
              title="Add Team Member"
            >
              <Plus size={14} className="border border-slate-200 dark:border-gray-800 rounded-md" />
            </button>
          </div>

          {/* Create column */}
          <Button
            onClick={() => setIsAddColumnDialogOpen(true)}
            variant="outline"
            className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-3.5 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold"
          >
            + Column
          </Button>
        </div>
      </header>

      {/* Dnd Board Container */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-grow overflow-x-auto overflow-y-auto p-6 flex gap-5 items-start snap-x snap-mandatory">
          <SortableContext items={columnsList} strategy={horizontalListSortingStrategy}>
            {columnsList.length > 0 ? (
              columnsList.map((colId) => (
                <KanbanColumn
                  key={colId}
                  columnId={colId}
                  tasks={tasksByColumn[colId] || []}
                  onDelete={() => setColumnToDelete(colId)}
                  onRename={handleRenameColumn}
                  onAddTask={() => {
                    onOpenTaskDialog(colId);
                  }}
                  onOpenTaskDetails={onOpenTaskDetails}
                  onDeleteTask={onDeleteTask}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center flex-grow h-64 border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl p-6 text-center bg-white dark:bg-gray-950/20">
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">No columns defined for this workspace.</p>
                <Button
                  onClick={() => setIsAddColumnDialogOpen(true)}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold"
                >
                  Create First Column
                </Button>
              </div>
            )}
          </SortableContext>
        </div>

        {/* Drag Overlay for gorgeous card pickup visuals */}
        <DragOverlay adjustScale={true}>
          {activeDragTask ? (
            <div className="rotate-3 opacity-90 cursor-grabbing">
              <Task task={activeDragTask} isDragOverlay={true} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Action Dialogs */}
      <ColumnDialog
        isOpen={isAddColumnDialogOpen}
        onClose={() => setIsAddColumnDialogOpen(false)}
        onAddColumn={handleAddColumn}
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