import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "./ui/Dialog";
import { useState, useEffect } from "react";

const TaskDialog = ({
  isOpen,
  onClose,
  columns,
  onAddTask,
  editingTask,
  onEditTask,
  selectedColumn,
}) => {
  const [newTask, setNewTask] = useState({
    id: "",
    content: "",
    priority: "medium",
    column: Object.keys(columns)[0] || "todo",
    date: new Date().toISOString().split("T")[0],
    deadline: "",
    username: "Aarav",
  });

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
    "Zara",
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
        username: "Aarav",
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
      <DialogContent className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl p-4 sm:p-6 max-w-[90vw] sm:max-w-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold">
            {editingTask ? "Edit Task" : "New Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="task-content" className="text-sm sm:text-base">
              Task Title
            </Label>
            <Input
              id="task-content"
              value={newTask.content}
              onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
              placeholder="Enter task title"
              className="border border-gray-300 dark:border-gray-600 rounded-md text-sm sm:text-base"
            />
          </div>

          <div>
            <Label htmlFor="task-column" className="text-sm sm:text-base">
              Column
            </Label>
            <Select
              value={newTask.column}
              onValueChange={(value) => setNewTask({ ...newTask, column: value })}
            >
              <SelectTrigger id="task-column" className="border border-gray-300 dark:border-gray-600 rounded-md text-sm sm:text-base">
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(columns).map((col) => (
                  <SelectItem key={col} value={col} className="text-sm sm:text-base">
                    {col.replace(/([A-Z])/g, " $1")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="task-priority" className="text-sm sm:text-base">
              Priority
            </Label>
            <Select
              value={newTask.priority}
              onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
            >
              <SelectTrigger id="task-priority" className="border border-gray-300 dark:border-gray-600 rounded-md text-sm sm:text-base">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high" className="text-sm sm:text-base">High</SelectItem>
                <SelectItem value="medium" className="text-sm sm:text-base">Medium</SelectItem>
                <SelectItem value="low" className="text-sm sm:text-base">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="task-date" className="text-sm sm:text-base">
              Created Date
            </Label>
            <Input
              id="task-date"
              type="date"
              value={newTask.date}
              onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 rounded-md text-sm sm:text-base"
            />
          </div>

          <div>
            <Label htmlFor="task-deadline" className="text-sm sm:text-base">
              Deadline
            </Label>
            <Input
              id="task-deadline"
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 rounded-md text-sm sm:text-base"
            />
          </div>

          <div>
            <Label htmlFor="task-username" className="text-sm sm:text-base">
              Assigned User
            </Label>
            <Select
              value={newTask.username}
              onValueChange={(value) => setNewTask({ ...newTask, username: value })}
            >
              <SelectTrigger id="task-username" className="border border-gray-300 dark:border-gray-600 rounded-md text-sm sm:text-base">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {indianNames.map((name) => (
                  <SelectItem key={name} value={name} className="text-sm sm:text-base">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md w-full sm:w-auto"
          >
            {editingTask ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;