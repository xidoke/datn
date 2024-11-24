"use client";

import * as React from "react";
import {
  ChevronDown,
  Plus,
  Settings,
  Briefcase,
  Inbox,
  MailPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppRouter } from "@/hooks/use-app-router";
import { useWorkspace } from "@/stores/workspaceStore";
import Image from "next/image";
import { API_BASE_URL } from "@/helpers/common.helper";

export function WorkspaceSwitcher() {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const { workspaceSlug } = useParams();
  if (
    workspaceSlug &&
    workspaceSlug !== currentWorkspace?.slug &&
    workspaces?.some((w) => w.slug === workspaceSlug)
  ) {
    setCurrentWorkspace(workspaceSlug as string);
  }
  const router = useAppRouter();

  const handleAddWorkspace = React.useCallback(() => {
    router.push("/create-workspace");
  }, [router]);

  const handleInvitation = React.useCallback(() => {
    router.push("/invitations");
  }, [router]);

  const renderWorkspaceIcon = (workspace: {
    logoUrl: string | null;
    name: string;
  }) => {
    if (workspace.logoUrl) {
      return (
        <div className="relative flex size-6 items-center justify-center overflow-hidden rounded-sm border">
          <Image
            src={`${API_BASE_URL}${workspace.logoUrl}`}
            alt={workspace.name}
            fill
            className="object-cover"
            sizes="24px"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const nextElement = target.nextSibling as HTMLElement | null;

              if (nextElement?.classList) {
                nextElement.classList.remove("hidden");
              }
            }}
          />
          <Briefcase className="hidden size-4" />
        </div>
      );
    }
    return (
      <div className="flex size-6 items-center justify-center rounded-sm border">
        <Briefcase className="size-4" />
      </div>
    );
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5">
              {renderWorkspaceIcon(
                currentWorkspace || {
                  logoUrl: null,
                  name: "Select Workspace",
                },
              )}
              <span className="truncate font-semibold">
                {currentWorkspace?.name || "Select Workspace"}
              </span>
              <ChevronDown className="opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {workspaces?.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                className="gap-2 p-2"
                asChild
              >
                <Link href={`/${workspace.slug}`} className="flex items-center">
                  {renderWorkspaceIcon(workspace)}
                  <span className="ml-2">{workspace.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onSelect={handleAddWorkspace}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add workspace
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 p-2" onSelect={handleInvitation}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <MailPlus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Invite to workspace
              </div>
            </DropdownMenuItem>
            {currentWorkspace && (
              <DropdownMenuItem
                className="gap-2 p-2"
                onSelect={() =>
                  router.push(`/${currentWorkspace.slug}/settings`)
                }
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Settings className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Settings
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
