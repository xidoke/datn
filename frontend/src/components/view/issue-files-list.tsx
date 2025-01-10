import React, { useCallback } from "react";
import {
  ChevronDown,
  ChevronRight,
  Paperclip,
  Upload,
  Trash2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { FileAssetService } from "@/services/file-asset.service";
import { Issue } from "@/types/issue";
import { formatFileSize } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useUserStore } from "@/stores/userStore";
import Link from "next/link";
import { API_BASE_URL } from "@/helpers/common.helper";

interface IssueFilesListProps {
  issue: Issue;
  onUpdate: () => void;
}

const fileAssetService = new FileAssetService();

export function IssueFilesList({ issue, onUpdate }: IssueFilesListProps) {
  const { workspaceSlug, projectId } = useParams();
  const fileAssets = issue.FileAssets || [];
  const { data: user } = useUserStore();
  const { getWorkspaceBySlug } = useWorkspaceStore();
  const workspace = getWorkspaceBySlug(workspaceSlug as string);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        try {
          await fileAssetService.createFileAsset({
            file,
            entityType: "ISSUE_ATTACHMENT",
            entityId: issue.id,
            workspaceId: workspace?.id as string,
            userId: user?.id as string,
          });
          onUpdate();
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    },
    [issue.id, workspaceSlug, onUpdate],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemoveFile = async (fileId: string) => {
    try {
      await fileAssetService.deleteFileAsset(fileId);
      onUpdate();
    } catch (error) {
      console.error("Error removing file:", error);
    }
  };

  return (
    <Disclosure
      as="div"
      className="z-auto flex flex-shrink-0 flex-col bg-backdrop"
      defaultOpen={false}
    >
      {({ open }) => (
        <>
          <DisclosureButton className="sticky top-0 w-full flex-shrink-0 cursor-pointer border-b border-border bg-background p-2 hover:bg-accent">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {open ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">Files</span>
                <Badge variant="secondary" className="text-xs">
                  {fileAssets.length}
                </Badge>
              </div>
            </div>
          </DisclosureButton>
          <DisclosurePanel>
            <ScrollArea className="h-full">
              <ul className="space-y-1 p-2">
                {fileAssets.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
                  >
                    <Link
                      href={API_BASE_URL + "/uploads/" + file.asset}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center space-x-2">
                        <Paperclip className="h-4 w-4" />
                        <span className="text-sm">{file.attributes.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.attributes.size)}
                        </span>
                      </div>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
              <div
                {...getRootProps()}
                className={`m-2 border-2 border-dashed border-gray-300 p-4 text-center ${
                  isDragActive ? "bg-blue-50" : ""
                }`}
              >
                <input {...getInputProps()} />
                <p>
                  Drag &apos;n&apos; drop some files here, or click to select
                  files
                </p>
                <Button className="mt-2" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </Button>
              </div>
            </ScrollArea>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
