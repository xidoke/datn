"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/stores/workspaceStore";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/helpers/common.helper";
import WorkspaceLogo from "@/components/workspaces/workspace-logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function GeneralSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { workspaces, updateWorkspace, updateWorkspaceLogo, deleteWorkspace } =
    useWorkspace();
  const workspace = workspaces.find((w) => w.slug === params.workspaceSlug);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) return;

    setIsLoading(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get("name") as string;

      await updateWorkspace(params.workspaceSlug as string, { name });

      toast({
        title: "Workspace updated",
        description: "Your workspace settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update workspace:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ??
          "Failed to update workspace. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!workspace || deleteConfirmation !== workspace.name) return;

    setIsLoading(true);
    try {
      await deleteWorkspace(workspace.slug);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Workspace deleted",
        description: "Your workspace has been deleted successfully.",
      });
      router.push("/"); // Redirect to home page or workspace list
    } catch (error) {
      console.error("Failed to delete workspace:", error);
      toast({
        title: "Error",
        description: "Failed to delete workspace. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = async (file: File) => {
    if (!workspace) return;

    setIsLoading(true);
    try {
      await updateWorkspaceLogo(workspace.slug, file);
      toast({
        title: "Success",
        description: "Logo updated successfully",
      });
    } catch (error) {
      console.error("Failed to update logo:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ??
          "Failed to update logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!workspace) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">General Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workspace Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={workspace.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Workspace URL</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  localhost:3000
                </span>
                <Input
                  id="url"
                  name="url"
                  defaultValue={workspace.slug}
                  disabled
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Logo</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkspaceLogo
            logoUrl={workspace?.logoUrl || null}
            onLogoChange={handleLogoChange}
            isLoading={isLoading}
            apiBaseUrl={API_BASE_URL}
          />
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
              <Button variant="destructive">Delete Workspace</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your workspace and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>
                  Please type <strong>{workspace.name}</strong> to confirm.
                </p>
                <Input
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type workspace name to confirm"
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
                  onClick={handleDeleteWorkspace}
                  disabled={deleteConfirmation !== workspace.name || isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete Workspace"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
