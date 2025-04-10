import { Button, Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger, Input, Label } from "@/components/ui";
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
      <DialogContent>
        <DialogHeader>
          <h3 className="text-lg font-semibold">New Column</h3>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="column-name">Column Name</Label>
            <Input
              id="column-name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Enter column name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddColumn}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnDialog;