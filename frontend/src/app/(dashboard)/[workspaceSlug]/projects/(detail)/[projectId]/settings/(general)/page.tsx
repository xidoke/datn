"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/stores/workspaceStore";

// TODO: update other settings
export default function GeneralSettingsPage() {
  const params = useParams();
  const { workspaces, updateWorkspace} = useWorkspace();
  const workspace = workspaces.find((w) => w.slug === params.workspaceSlug);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) return;

    setIsLoading(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      await updateWorkspace(params.workspaceSlug as string,{
        name: formData.get("name") as string,
      });
    } catch (error) {
      console.error("Failed to update workspace:", error);
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
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add a description for your workspace..."
              />
            </div>
            <Button type="submit" disabled={isLoading}>
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
          <Button variant="destructive">Delete Workspace</Button>
        </CardContent>
      </Card>
    </div>
  );
}
