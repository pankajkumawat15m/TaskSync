import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui";

const DeleteColumnDialog = ({ isOpen, onClose, columnName, onDelete }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl p-4 sm:p-6 max-w-[90vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <h3 className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">
            Confirm Delete Column
          </h3>
        </DialogHeader>

        <p className="py-3 sm:py-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
          Are you sure you want to delete the <strong>"{columnName}"</strong> column?
          <br />
          <span className="text-xs sm:text-sm italic">This action cannot be undone.</span>
        </p>

        <DialogFooter className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 w-full sm:w-auto text-sm sm:text-base"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white shadow-md w-full sm:w-auto text-sm sm:text-base"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteColumnDialog;