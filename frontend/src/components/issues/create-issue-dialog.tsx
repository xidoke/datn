"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectLabelStore } from "@/stores/projectLabelStore";
import { useProjectStateStore } from "@/stores/projectStateStore";
import { toast } from "@/hooks/use-toast";

interface CreateIssueDialogProps {
  children?: React.ReactNode;
  stateId?: string;
}

export function CreateIssueDialog({ stateId, children }: CreateIssueDialogProps) {
  const { createIssue } = useIssueStore();
  // const { labels } = useProjectLabelStore();
  const { states } = useProjectStateStore();
  const defaultState = states.find((state) => state.isDefault === true);

  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;
  const projectId = params.projectId as string;
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    priority: 2,
    stateId: stateId || defaultState?.id || "",
  });

  // Reset form data when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        description: "",
        priority: 2,
        stateId: stateId || defaultState?.id || "",
      });
    }
  }, [open, stateId, defaultState]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceSlug || !projectId) return;

    setIsSubmitting(true);
    try {
      const { title, description, priority, stateId } = formData;

      await createIssue(workspaceSlug, projectId, {
        title,
        description,
        priority,
        stateId,
      });
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        priority: 2,
        stateId: "",
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

          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="1">Low</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">High</SelectItem>
                  <SelectItem value="4">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.stateId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, stateId: value }))
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {isSubmitting ? "Creating..." : "Create issue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
