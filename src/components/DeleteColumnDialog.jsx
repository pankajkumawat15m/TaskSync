import { Button, Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger } from "@/components/ui";

const DeleteColumnDialog = ({ isOpen, onClose, columnName, onDelete }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h3 className="text-lg font-semibold">Confirm Delete Column</h3>
        </DialogHeader>
        <p className="py-4">
          Are you sure you want to delete the "{columnName}" column? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteColumnDialog;