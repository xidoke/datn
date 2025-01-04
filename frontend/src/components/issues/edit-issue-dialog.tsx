"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { CalendarCheck2, CalendarClock } from "lucide-react";
import useIssueStore from "@/stores/issueStore";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { StateDropdown } from "../dropdown/state";
import { PriorityDropdown } from "../dropdown/priority";
import { TIssuePriorities, Issue } from "@/types";
import { LabelDropdown } from "../dropdown/label";
import { AssigneeDropdown } from "../dropdown/assignees";
import { DatePicker } from "../ui/date-picker";
import { AIDescriptionPopover } from "../view/kanban/ai-description-popover";
import { CycleDropdown } from "../dropdown/cycle";

interface EditIssueDialogProps {
  issue: Issue;
  isOpen: boolean;
  handleClose: () => void;
}

interface FormData {
  title: string;
  description: string;
  priority: number;
  stateId: string;
  dueDate: string | null;
  labelIds: string[];
  assigneeIds: string[];
  startDate: string | null;
  cycleId: string | null;
}

export function EditIssueDialog({
  issue,
  isOpen,
  handleClose,
}: EditIssueDialogProps) {
  const { updateIssue } = useIssueStore();
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;
  const projectId = params.projectId as string;
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState<FormData>({
    title: issue.title,
    description: issue.description || "",
    priority: issue.priority,
    stateId: issue.stateId,
    labelIds: issue.labelIds || [],
    assigneeIds: issue.assignees.map(
      (assignee) => assignee.workspaceMember.user.id,
    ),
    startDate: issue.startDate || null,
    dueDate: issue.dueDate || null,
    cycleId: issue.cycleId || null,
  });

  // Reset form data when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        title: issue.title,
        description: issue.description || "",
        priority: issue.priority,
        stateId: issue.stateId,
        labelIds: issue.labelIds || [],
        assigneeIds: issue.assignees.map(
          (assignee) => assignee.workspaceMember.user.id,
        ),
        startDate: issue.startDate || null,
        dueDate: issue.dueDate || null,
        cycleId: issue.cycleId || null,
      });
    }
  }, [isOpen, issue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceSlug || !projectId) return;

    setIsSubmitting(true);
    try {
      const {
        title,
        description,
        priority,
        stateId,
        labelIds,
        assigneeIds,
        startDate,
        dueDate,
        cycleId,
      } = formData;

      await updateIssue(workspaceSlug, projectId, issue.id, {
        title,
        description,
        priority,
        stateId,
        labelIds,
        assigneeIds,
        startDate,
        dueDate,
        cycleId,
      });
      handleClose();
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
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-[650px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Issue</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to your issue here. Click save when you&apos;re done.
          </AlertDialogDescription>
        </AlertDialogHeader>
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
            <div className="relative">
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
                className="mt-1.5 h-32 resize-none pr-10"
              />
              <div className="absolute right-2 top-2">
                <AIDescriptionPopover
                  onDescriptionGenerated={(description) =>
                    setFormData((prev) => ({ ...prev, description }))
                  }
                />
              </div>
            </div>
          </div>

          <hr />
          <div className="flex flex-wrap gap-4">
            <StateDropdown
              value={formData.stateId}
              projectId={projectId}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, stateId: value }))
              }
              size="sm"
            />
            <PriorityDropdown
              size="sm"
              placeholder="Select priority"
              value={formData.priority.toString() as TIssuePriorities}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: parseInt(value),
                }))
              }
            />
            <LabelDropdown
              placeHolder="Select labels"
              projectId={projectId}
              showCount={false}
              maxDisplayedLabels={2}
              size="sm"
              values={formData.labelIds}
              onChange={(values) =>
                setFormData((prev) => ({ ...prev, labelIds: values }))
              }
            />
            <AssigneeDropdown
              size="sm"
              projectId={projectId}
              values={formData.assigneeIds}
              onChange={(values) =>
                setFormData((prev) => ({ ...prev, assigneeIds: values }))
              }
            />
            <CycleDropdown
              projectId={projectId}
              value={formData.cycleId}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  cycleId: value,
                }))
              }
              size="sm"
            />

            <DatePicker
              date={formData.startDate}
              Icon={CalendarCheck2}
              clearIconClassName="ml-1"
              onDateChange={(date) => {
                setFormData((prev) => ({
                  ...prev,
                  startDate: date || null,
                }));
              }}
              maxDate={formData.dueDate || undefined}
              size="sm"
              placeholder="Start date"
            />
            <DatePicker
              date={formData.dueDate}
              Icon={CalendarClock}
              clearIconClassName="ml-1"
              onDateChange={(date) => {
                setFormData((prev) => ({
                  ...prev,
                  dueDate: date || null,
                }));
              }}
              minDate={formData.startDate || undefined}
              size="sm"
              placeholder="Due date"
            />
          </div>
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update issue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
