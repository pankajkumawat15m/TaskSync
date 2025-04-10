import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui";
import { useState } from "react";
import React from "react";

const SortableTask = React.memo(({ task, columnId, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "transform 0.2s ease",
  };
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const priorityColors = {
    high: "border-l-task-border-high",
    medium: "border-l-task-border-medium",
    low: "border-l-task-border-low",
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        className="cursor-move bg-card p-3 mb-3 rounded-lg border-l-4 shadow-card hover:shadow-card-hover transition-shadow duration-200"
      >
        <Input
          value={editedTask.content}
          onChange={(e) => setEditedTask({ ...editedTask, content: e.target.value })}
          placeholder="Task Title"
          className="mb-2 border-input"
        />
        <Select
          value={editedTask.priority}
          onValueChange={(value) => setEditedTask({ ...editedTask, priority: value })}
          className="w-full mb-2"
        >
          <SelectTrigger className="border-input">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex space-x-2">
          <Button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(editedTask); setIsEditing(false); console.log("Save task clicked"); }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          >
            Save
          </Button>
          <Button
            variant="outline"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(false); console.log("Cancel task clicked"); }}
            className="border-input hover:bg-accent/50 transition-colors duration-200"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`cursor-move bg-card p-3 mb-3 rounded-lg border-l-4 ${priorityColors[task.priority || "medium"]} shadow-card hover:shadow-card-hover transition-shadow duration-200`}
      {...attributes}
      {...listeners}
      style={style}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-foreground line-clamp-2">{task.content}</p>
          <span className="inline-block mt-1 px-2 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
            {task.priority.toUpperCase()}
          </span>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(true); console.log("Edit task button clicked"); }}
            className="border-primary text-primary hover:bg-primary/10 transition-colors duration-200"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(e); console.log("Delete task button clicked"); }}
            className="hover:bg-destructive/90 transition-colors duration-200"
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground mt-2 space-y-1">
        <p>Time: {task.timeSpent || "0h 0m"}</p>
        <p>Created: {new Date(task.date).toLocaleDateString()}</p>
        {task.deadline && <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>}
      </div>
    </div>
  );
});

export default SortableTask;