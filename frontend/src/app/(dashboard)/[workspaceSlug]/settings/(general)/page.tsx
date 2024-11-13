"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/stores/workspaceStore";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/helpers/common.helper";
import WorkspaceLogo from "@/components/workspaces/workspace-logo";

export default function GeneralSettingsPage() {
  const params = useParams();
  const { workspaces, updateWorkspace, updateWorkspaceLogo } = useWorkspace();
  const workspace = workspaces.find((w) => w.slug === params.workspaceSlug);
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    workspace?.logo_url || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        description: "Failed to update workspace. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && workspace) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        setIsLoading(true);
        await updateWorkspaceLogo(workspace.slug, file);
        toast({
          title: "Logo updated",
          description: "Your workspace logo has been updated successfully.",
        });
      } catch (error) {
        console.error("Failed to update logo:", error);
        toast({
          title: "Error",
          description: "Failed to update logo. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
            logoUrl={workspace?.logo_url || null}
            onLogoChange={async (file) => {
              try {
                setIsLoading(true);
                await updateWorkspaceLogo(workspace.slug, file);
                toast({
                  title: "Success",
                  description: "Logo updated successfully",
                });
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to update logo",
                  variant: "destructive",
                });
              } finally {
                setIsLoading(false);
              }
            }}
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
          <Button variant="destructive">Delete Workspace</Button>
        </CardContent>
      </Card>
    </div>
  );
}
