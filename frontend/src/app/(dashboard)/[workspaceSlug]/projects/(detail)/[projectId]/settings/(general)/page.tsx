/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProject } from "@/stores/projectStore";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { hasPermission } from "@/helpers/permission";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().optional(),
  token: z
    .string()
    .nonempty("Token is required")
    .regex(
      /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      "Token must be a valid variable-like string",
    )
    .max(5, "Token must be at most 5 characters"),
});

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, updateProject, deleteProject } = useProject();
  const { getPermissions } = useWorkspaceStore();
  const permissions = getPermissions(params.workspaceSlug as string);
  const project = projects.find((p) => p.id === params.projectId);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setIsLoading(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        token: formData.get("token") as string,
      };

      const parsedData = projectSchema.parse(data);

      await updateProject(
        params.workspaceSlug as string,
        params.projectId as string,
        parsedData,
      );

      toast({
        title: "Project updated",
        description: "Your project settings have been updated successfully.",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors.map((err) => err.message).join(", "),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            error.message || "Failed to update project. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project || deleteConfirmation !== project.name) return;

    setIsLoading(true);
    try {
      await deleteProject(params.workspaceSlug as string, project.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
      });
      router.push(`/${params.workspaceSlug}`); // Redirect to workspace page
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!project) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={project.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={project.description}
                placeholder="Enter project description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="token">Project Identifier</Label>
              <Input id="token" name="token" defaultValue={project.token} />
            </div>
            <Button
              type="submit"
              disabled={
                !hasPermission(permissions, "UPDATE_PROJECT") || isLoading
              }
            >
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={!hasPermission(permissions, "DELETE_PROJECT")}
              >
                Delete Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your project and remove all associated data from our servers.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>
                  Please type <strong>{project.name}</strong> to confirm.
                </p>
                <Input
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type project name to confirm"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteProject}
                  disabled={deleteConfirmation !== project.name || isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete Project"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
