import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/Select";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "./ui/Dialog";
import { useState, useEffect } from "react";

const TaskDialog = ({ isOpen, onClose, columns, onAddTask, editingTask, onEditTask, selectedColumn }) => {
  const [newTask, setNewTask] = useState({
    id: "",
    content: "",
    priority: "medium",
    column: Object.keys(columns)[0] || "todo",
    date: new Date().toISOString().split("T")[0],
    deadline: "",
    username: "Aarav", // Default to first name
  });

  // List of 10 Indian names for the dropdown
  const indianNames = [
    "Aarav",
    "Ananya",
    "Arjun",
    "Diya",
    "Ishaan",
    "Kavya",
    "Rahul",
    "Saanvi",
    "Vikram",
    "Zara"
  ];

  useEffect(() => {
    if (editingTask) {
      setNewTask(editingTask);
    } else {
      setNewTask((prev) => ({
        ...prev,
        id: "",
        content: "",
        priority: "medium",
        column: selectedColumn || Object.keys(columns)[0] || "todo",
        date: new Date().toISOString().split("T")[0],
        deadline: "",
        username: "Aarav", // Reset to default
      }));
    }
  }, [editingTask, columns, selectedColumn]);

  const handleSave = () => {
    if (!newTask.content.trim()) return;
    if (editingTask) {
      onEditTask(newTask);
    } else {
      onAddTask(newTask);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">{editingTask ? "Edit Task" : "New Task"}</DialogTitle>
          <p className="sr-only">Add or edit a task with title, column, priority, date, deadline, and username.</p>
          <h3 className="text-lg font-semibold text-foreground">{editingTask ? "Edit Task" : "New Task"}</h3>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-content">Task Title</Label>
            <Input
              id="task-content"
              value={newTask.content}
              onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
              placeholder="Enter task title"
              className="border-input"
            />
          </div>
          <div>
            <Label htmlFor="task-column">Column</Label>
            <Select
              value={newTask.column}
              onValueChange={(value) => setNewTask({ ...newTask, column: value })}
            >
              <SelectTrigger id="task-column" className="border-input">
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(columns).map((col) => (
                  <SelectItem key={col} value={col}>
                    {col.replace(/([A-Z])/g, " $1")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="task-priority">Priority</Label>
            <Select
              value={newTask.priority}
              onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
            >
              <SelectTrigger id="task-priority" className="border-input">
                <SelectValue placeholder="Select a priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="task-date">Date</Label>
            <Input
              id="task-date"
              type="date"
              value={newTask.date}
              onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
              className="border-input"
            />
          </div>
          <div>
            <Label htmlFor="task-deadline">Deadline</Label>
            <Input
              id="task-deadline"
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              className="border-input"
            />
          </div>
          <div>
            <Label htmlFor="task-username">Assigned User</Label>
            <Select
              value={newTask.username}
              onValueChange={(value) => setNewTask({ ...newTask, username: value })}
            >
              <SelectTrigger id="task-username" className="border-input">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {indianNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-input hover:bg-accent/50 transition-colors duration-200">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200">
            {editingTask ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;