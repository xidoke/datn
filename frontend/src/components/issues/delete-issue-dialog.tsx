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
import { Issue } from "@/types";
import useIssueStore from "@/stores/issueStore";

interface DeleteDialogProps {
  issue: Issue;
  workspaceSlug: string;
  projectId: string;
  isOpen: boolean;
  handleClose: () => void;
}

export const DeleteIssueDialog = (prop: DeleteDialogProps) => {
  const { issue, isOpen, handleClose, workspaceSlug, projectId } = prop;
  const { deleteIssue } = useIssueStore();
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete issue</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete issue {issue.fullIdentifier} All of
            the data related to the issue will be permanently removed. This
            action cannot be undone.
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
              deleteIssue(workspaceSlug, projectId, issue.id);
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
