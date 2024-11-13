"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";

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

interface CreateProjectDialogProps {
  children?: React.ReactNode;
}

export function CreateProjectDialog({ children }: CreateProjectDialogProps) {
  const { workspaceSlug } = useParams();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { createProject } = useProjectStore();

  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceSlug) return;

    setIsSubmitting(true);
    try {
      await createProject(workspaceSlug as string, formData);
      setOpen(false);
      setFormData({
        name: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to create project:", error);
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
                    <span className="sr-only">New Project</span>
                  </div>
                )}
                {children}
              </div>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create New Project</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter project name"
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
              placeholder="Enter project description"
              className="mt-1.5 h-32 resize-none"
            />
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
              {isSubmitting ? "Creating..." : "Create project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
