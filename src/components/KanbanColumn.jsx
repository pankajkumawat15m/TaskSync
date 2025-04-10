import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import SortableTask from "./SortableTask";
import React from "react";

const KanbanColumn = React.memo(({ columnId, tasks, onDelete, onAddTask, onEditTask, onDeleteTask }) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: columnId,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "transform 0.2s ease",
  };

  return (
    <div
      className="min-w-[280px] max-w-[280px] flex-shrink-0 bg-card p-4 rounded-lg shadow-card border border-border hover:shadow-card-hover transition-shadow duration-200"
    >
      <div ref={setNodeRef} {...attributes} className="h-full"> {/* Removed {...listeners} here */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground capitalize">
            {columnId.replace(/([A-Z])/g, " $1")}
          </h2>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(e); console.log("Delete Column button clicked"); }}
            className="hover:bg-destructive/90 transition-colors duration-200"
          >
            Delete
          </Button>
        </div>
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <SortableTask
                key={task.id}
                task={task}
                columnId={columnId}
                onEdit={(e) => { e.preventDefault(); e.stopPropagation(); onEditTask(task); console.log("Edit task clicked"); }}
                onDelete={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteTask(columnId, task.id); console.log("Delete task clicked"); }}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No tasks</p>
          )}
        </SortableContext>
        <Button
          variant="outline"
          className="mt-4 w-full bg-muted text-primary hover:bg-muted/80 transition-colors duration-200"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddTask(e); console.log("Add Task button clicked"); }}
        >
          + Add Task
        </Button>
      </div>
    </div>
  );
});

export default KanbanColumn;