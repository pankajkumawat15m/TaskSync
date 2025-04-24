import { Button } from "@/components/ui/Button";
 
import Task from "./Task";
import React from "react";

const KanbanColumn = React.memo(
  ({ columnId, tasks, onDelete, onAddTask, onEditTask, onDeleteTask, onOpenTaskDialog }) => {
    return (
      <div className="w-72 flex-shrink-0 bg-card p-4 rounded-lg shadow-card border border-border hover:shadow-card-hover transition-shadow duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground capitalize">
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
            className="hover:bg-destructive/90 transition-colors duration-200"
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
          <p className="text-muted-foreground text-center py-4">No tasks</p>
        )}
        <Button
          variant="outline"
          className="mt-4 w-full bg-muted text-primary hover:bg-muted/80 transition-colors duration-200"
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