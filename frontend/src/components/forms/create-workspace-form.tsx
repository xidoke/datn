"use client";

import { useState } from "react";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAppRouter } from "@/hooks/use-app-router";

export default function CreateWorkspaceForm() {
  const router = useAppRouter();
  const { addWorkspace } = useWorkspaces();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    size: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const workspace = await addWorkspace({
        name: formData.name,
        logo: "building", // Default logo
      });
      router.push(`/${workspace.id}`);
    } catch (error) {
      console.error("Failed to create workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Workspace Name</Label>
        <Input
          id="name"
          placeholder="Enter workspace name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Workspace URL</Label>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">localhost:3000/</span>
          <Input
            id="url"
            placeholder="your-workspace-url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>What size is your organization?</Label>
        <Select
          value={formData.size}
          onValueChange={(value) => setFormData({ ...formData, size: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select organization size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-10">1-10 employees</SelectItem>
            <SelectItem value="11-50">11-50 employees</SelectItem>
            <SelectItem value="51-200">51-200 employees</SelectItem>
            <SelectItem value="201-500">201-500 employees</SelectItem>
            <SelectItem value="501+">501+ employees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Workspace"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleGoBack}
          disabled={isLoading}
        >
          Go back
        </Button>
      </div>
    </form>
  );
}
