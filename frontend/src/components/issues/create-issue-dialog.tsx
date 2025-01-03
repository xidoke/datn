"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { CalendarCheck2, CalendarClock, Plus } from "lucide-react";
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
import { TIssuePriorities } from "@/types";
import { LabelDropdown } from "../dropdown/label";
import { AssigneeDropdown } from "../dropdown/assignees";
import { DatePicker } from "../ui/date-picker";
import { AIDescriptionPopover } from "../view/kanban/ai-description-popover";

interface CreateIssueDialogProps {
  children?: React.ReactNode;
  stateId?: string;
}

interface FormData {
  title: string;
  description: string;
  priority: number;
  stateId: string;
  dueDate?: string;
  labelIds?: string[];
  assigneeIds?: string[];
  startDate?: string;
}

export function CreateIssueDialog({
  stateId,
  children,
}: CreateIssueDialogProps) {
  const { createIssue } = useIssueStore();
  const { states } = useProjectStateStore();
  const { cycleId } = useParams();

  const defaultState = states.find((state) => state.isDefault === true);

  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;
  const projectId = params.projectId as string;
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState<FormData>({
    title: "",
    description: "",
    priority: 0,
    stateId: stateId || defaultState?.id || "",
    labelIds: [],
    assigneeIds: [],
    startDate: undefined,
    dueDate: undefined,
  });

  // Reset form data when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        description: "",
        priority: 0,
        stateId: stateId || defaultState?.id || "",
        labelIds: [],
        assigneeIds: [],
        startDate: undefined,
        dueDate: undefined,
      });
    }
  }, [open, stateId, defaultState]);

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
      } = formData;

      await createIssue(workspaceSlug, projectId, {
        title,
        description,
        priority,
        stateId,
        labelIds,
        assigneeIds,
        startDate,
        dueDate,
        cycleId: cycleId as string,
      });
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        priority: 2,
        stateId: "",
        labelIds: [],
        assigneeIds: [],
        startDate: undefined,
        dueDate: undefined,
      });
      // toast hook
      toast({
        title: "Issue created",
        description: "Your issue has been created successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Issue creation failed",
        description: "An error occurred while creating the issue.",
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
            <DialogTrigger asChild>
              <div>
                {!children && (
                  <div className="cursor-pointer rounded-full p-1 transition-colors duration-200 hover:bg-gray-200">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">New Issue</span>
                  </div>
                )}
                {children}
              </div>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create New Issue</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[600px]">
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
          <div className="flex flex-wrap space-x-4">
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
            </div>
            <div>
              <LabelDropdown
                placeHolder="Select labels"
                projectId={projectId}
                showCount={false}
                maxDisplayedLabels={2}
                size="default"
                values={formData.labelIds ?? []}
                onChange={(values) =>
                  setFormData((prev) => ({ ...prev, labelIds: values }))
                }
              />
            </div>
          </div>

          <div />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create issue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
