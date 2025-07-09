import { Button } from "@/components/ui/Button";
import Task from "./Task";
import React from "react";

const KanbanColumn = React.memo(
  ({ columnId, tasks, onDelete, onAddTask, onEditTask, onDeleteTask, onOpenTaskDialog }) => {
    return (
      <div className="w-full sm:w-64 md:w-72 flex-shrink-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 p-3 sm:p-4 rounded-2xl shadow-md border border-gray-700 hover:shadow-xl transition-shadow duration-300 snap-center">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white capitalize">
            {columnId.replace(/([A-Z])/g, " $1")}
          </h2>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(e);
            }}
            className="hover:bg-red-600/90 transition duration-200 text-xs sm:text-sm"
          >
            Delete
          </Button>
        </div>

        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              columnId={columnId}
              onEdit={(task) => {
                onEditTask(task);
                onOpenTaskDialog();
              }}
              onDelete={onDeleteTask}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center py-3 sm:py-4 text-sm sm:text-base">
            No tasks
          </p>
        )}

        <Button
          variant="outline"
          className="mt-3 sm:mt-4 w-full bg-gray-900 text-white hover:bg-gray-800 border border-blue-500 rounded-full transition duration-200 text-sm sm:text-base"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddTask(e);
          }}
        >
          + Add Task
        </Button>
      </div>
    );
  }
);

export default KanbanColumn;