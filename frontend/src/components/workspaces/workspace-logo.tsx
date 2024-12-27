"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { useWorkspace } from "@/stores/workspaceStore";
import { hasPermission } from "@/helpers/permission";

interface WorkspaceLogoProps {
  logoUrl: string | null;
  onLogoChange: (file: File) => void;
  isLoading?: boolean;
  apiBaseUrl: string;
}

export default function WorkspaceLogo({
  logoUrl,
  onLogoChange,
  isLoading = false,
  apiBaseUrl,
}: WorkspaceLogoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { workspaceSlug } = useParams();

  const { workspaces } = useWorkspace();
  const currentWorkspace = (workspaces ?? []).find(
    (w) => w.slug === workspaceSlug,
  );
  const permissions = currentWorkspace?.permissions || [];
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("File must be an image");
        return;
      }

      onLogoChange(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {logoUrl && (
          <div className="relative h-16 w-16 overflow-hidden rounded border border-border">
            <Image
              src={`${apiBaseUrl}${logoUrl}`}
              alt="Workspace Logo"
              fill
              className="object-cover"
              sizes="64px"
              onError={(e) => {
                // Fallback to a default image or hide on error
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={
            !hasPermission(permissions, "UPDATE_WORKSPACE") || isLoading
          }
          variant="secondary"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isLoading ? "Uploading..." : "Upload Logo"}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleLogoChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
