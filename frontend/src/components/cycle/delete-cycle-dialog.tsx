import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ICycle } from "@/types/cycle";
import { useCycleStore } from "@/stores/cycleStore";

interface DeleteDialogProps {
  cycle: ICycle;
  workspaceSlug: string;
  projectId: string;
  isOpen: boolean;
  handleClose: () => void;
}

export const DeleteCycleDialog = (prop: DeleteDialogProps) => {
  const { cycle, isOpen, handleClose, workspaceSlug, projectId } = prop;
  const { deleteCycle } = useCycleStore();
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete cycle</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete cycle "{cycle.title}" All of the data
            related to the cycle will be permanently removed. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(event) => {
              // event.preventDefault();
              handleClose();
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteCycle(workspaceSlug, projectId, cycle.id);
            }}
            className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
