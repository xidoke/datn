"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Edit } from "lucide-react";
import useIssueStore from "@/stores/issueStore";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProjectStateStore } from "@/stores/projectStateStore";
import { toast } from "@/hooks/use-toast";
import { StateDropdown } from "../dropdown/state";
import { PriorityDropdown } from "../dropdown/priority";
import { TIssuePriorities, Issue } from "@/types";
import { LabelDropdown } from "../dropdown/label";

interface EditIssueDialogProps {
  issue: Issue;
  children?: React.ReactNode;
}

interface FormData {
  title: string;
  description: string;
  priority: number;
  stateId: string;
  dueDate?: string;
  labelIds?: string[];
}

export function EditIssueDialog({ issue, children }: EditIssueDialogProps) {
  const { updateIssue } = useIssueStore();
  const { states } = useProjectStateStore();
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;
  const projectId = params.projectId as string;
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState<FormData>({
    title: issue.title,
    description: issue.description || "",
    priority: issue.priority,
    stateId: issue.stateId,
    labelIds: issue.labelIds,
  });

  // Reset form data when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormData({
        title: issue.title,
        description: issue.description || "",
        priority: issue.priority,
        stateId: issue.stateId,
        labelIds: issue.labelIds,
      });
    }
  }, [open, issue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceSlug || !projectId) return;

    setIsSubmitting(true);
    try {
      const { title, description, priority, stateId, labelIds } = formData;

      await updateIssue(workspaceSlug, projectId, issue.id, {
        title,
        description,
        priority,
        stateId,
        labelIds,
      });
      setOpen(false);
      toast({
        title: "Issue updated",
        description: "Your issue has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Issue update failed",
        description: "An error occurred while updating the issue.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger
              onClick={(event) => {
                event.stopPropagation();
              }}
              className="w-full text-left"
            >
              <div className="">
                {
                  !children && "Edit"
                  //   <div className="cursor-pointer rounded-full p-1 transition-colors duration-200 hover:bg-gray-200">
                  //     <Edit className="h-4 w-4" />
                  //     <span className="sr-only">Edit Issue</span>
                  //   </div>
                }
                {children}
              </div>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <p>Edit Issue</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent
        className="sm:max-w-[600px]"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Issue title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter issue title"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter issue description"
              className="mt-1.5 h-32 resize-none"
            />
          </div>

          <hr />
          <div className="flex space-x-4">
            <div>
              <StateDropdown
                value={formData.stateId}
                projectId={projectId}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, stateId: value }))
                }
              />
            </div>
            <div>
              <PriorityDropdown
                value={formData.priority.toString() as TIssuePriorities}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: parseInt(value),
                  }))
                }
              />
            </div>
            <div>
              <LabelDropdown
                projectId={projectId}
                showCount={false}
                maxDisplayedLabels={3}
                values={formData.labelIds ?? []}
                onChange={(values) =>
                  setFormData((prev) => ({ ...prev, labelIds: values }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update issue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
