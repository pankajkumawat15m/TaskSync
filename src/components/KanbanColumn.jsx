import React, { useState } from "react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Task from "./Task";
import { Trash2, GripHorizontal, Plus } from "lucide-react";

const KanbanColumn = React.memo(({
  columnId,
  tasks,
  onDelete,
  onRename,
  onAddTask,
  onOpenTaskDetails,
  onDeleteTask,
  onUpdateTask
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: columnId,
    data: {
      type: "Column",
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const formattedName = columnId.replace(/([A-Z])/g, " $1");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(formattedName);

  const handleBlurOrSave = () => {
    setIsEditing(false);
    const cleaned = editName.trim();
    if (cleaned && cleaned !== formattedName) {
      onRename(columnId, cleaned);
    } else {
      setEditName(formattedName);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-72 flex-shrink-0 bg-white dark:bg-gray-950/70 border border-gray-200 dark:border-gray-800/80 p-4 rounded-2xl flex flex-col h-fit shadow-md hover:shadow-lg transition-all duration-300 snap-center relative ${
        isDragging ? "ring-2 ring-blue-500/50" : ""
      }`}
    >
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-150 dark:border-gray-900 select-none">
        <div className="flex items-center gap-2 max-w-[80%]">
          {/* Column drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-0.5 rounded transition flex-shrink-0"
            title="Drag Column"
          >
            <GripHorizontal size={16} />
          </div>

          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleBlurOrSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBlurOrSave();
                } else if (e.key === "Escape") {
                  setIsEditing(false);
                  setEditName(formattedName);
                }
              }}
              className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-xs font-bold px-1.5 py-0.5 rounded focus:outline-none focus:border-blue-500 text-gray-850 dark:text-white max-w-[120px]"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => setIsEditing(true)}
              className="text-sm font-extrabold capitalize tracking-wide text-gray-800 dark:text-gray-100 flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-900/60 px-1.5 py-0.5 rounded-lg transition overflow-hidden"
              title="Click to rename"
            >
              <span className="truncate">{formattedName}</span>
              <span className="bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-[10px] text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                {tasks.length}
              </span>
            </h3>
          )}
        </div>

        {/* Delete column button */}
        <button
          onClick={onDelete}
          className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition"
          title="Delete Column"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Task List container */}
      <div className="flex-grow space-y-3 pr-1.5">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                onClick={() => onOpenTaskDetails(task)}
                onDelete={onDeleteTask}
                onUpdateTask={onUpdateTask}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-gray-200 dark:border-gray-900 rounded-xl px-4 select-none">
              <span className="text-[20px] mb-1">📭</span>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 font-bold tracking-wider uppercase">
                Drop Zone Empty
              </p>
            </div>
          )}
        </SortableContext>
      </div>

      {/* Column Footer */}
      <div className="mt-4 pt-2 select-none">
        <button
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-1.5 border border-dashed border-slate-200 dark:border-gray-800 hover:border-blue-500 bg-slate-50 dark:bg-gray-900/40 hover:bg-blue-600/10 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 py-2.5 rounded-xl text-xs font-bold transition duration-200"
        >
          <Plus size={14} />
          <span>New Task</span>
        </button>
      </div>
    </div>
  );
});

export default KanbanColumn;