import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  Input,
  Label,
} from "@/components/ui";
import { useState } from "react";

const ColumnDialog = ({ isOpen, onClose, onAddColumn }) => {
  const [newColumnName, setNewColumnName] = useState("");

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    onAddColumn(newColumnName);
    setNewColumnName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl p-4 sm:p-6 max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <h3 className="text-lg sm:text-xl font-bold">Create New Column</h3>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label htmlFor="column-name">Column Name</Label>
            <Input
              id="column-name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Enter column name"
              className="border border-gray-300 dark:border-gray-600 rounded-md text-sm sm:text-base"
            />
          </div>
        </div>
        <DialogFooter className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-2 sm Friendship Link
        sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddColumn}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md w-full sm:w-auto"
          >
            Add Column
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnDialog;