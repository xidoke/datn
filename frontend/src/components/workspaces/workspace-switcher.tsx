"use client";

import * as React from "react";
import { ChevronDown, Plus, Settings, MailPlus } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppRouter } from "@/hooks/use-app-router";
import { useWorkspace } from "@/stores/workspaceStore";
import Image from "next/image";
import { API_BASE_URL } from "@/helpers/common.helper";
import { cn } from "@/lib/utils";

export function WorkspaceSwitcher() {
  const { workspaces } = useWorkspace();
  const { workspaceSlug } = useParams();
  const currentWorkspace = workspaces?.find((w) => w.slug === workspaceSlug);

  const router = useAppRouter();

  const { state, isMobile } = useSidebar();
  const sidebarCollapsed = !isMobile && state === "collapsed" ;
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
        <div className="relative h-6 w-6">
          <Image
            src={`${API_BASE_URL}${workspace.logoUrl}`}
            alt={workspace.name}
            className="rounded object-cover"
            fill
          />
        </div>
      );
    }
    return (
      <div className="flex size-6 items-center justify-center rounded border bg-primary text-primary-foreground">
        {workspace.name[0].toUpperCase()}
      </div>
    );
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className={cn(
                "group/menu-button roup-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:!p-0",
                sidebarCollapsed && "flex items-center justify-center",
              )}
            >
              <div className="flex items-center justify-center">
                {renderWorkspaceIcon(
                  currentWorkspace || {
                    logoUrl: null,
                    name: "Select Workspace",
                  },
                )}
              </div>

              {!sidebarCollapsed && (
                <span className="truncate font-semibold">
                  {currentWorkspace?.name || "Select Workspace"}
                </span>
              )}
              {!sidebarCollapsed && (
                <span>
                  <ChevronDown className="mx-1 hidden size-4 flex-shrink-0 duration-300 group-hover/menu-button:block" />
                </span>
              )}
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
