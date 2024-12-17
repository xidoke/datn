// src/components/user-avatar.tsx

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/helpers/common.helper";

interface UserAvatarProps {
  avatarUrl: string | undefined;
  onAvatarChange: (file: File) => Promise<void>;
  isLoading: boolean;
}

export default function UserAvatar({
  avatarUrl,
  onAvatarChange,
  isLoading,
}: UserAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      try {
        await onAvatarChange(file);
        toast({
          title: "Success",
          description: "Avatar updated successfully",
        });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error : any) {
        console.error("Failed to update avatar:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to update avatar",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {avatarUrl && (
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-border">
            <Image
              src={`${API_BASE_URL}${avatarUrl}`}
              
              alt="User Avatar"
              fill
              className="object-cover"
              sizes="96px"
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
          disabled={isLoading}
          variant="secondary"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isLoading ? "Uploading..." : "Upload Avatar"}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
