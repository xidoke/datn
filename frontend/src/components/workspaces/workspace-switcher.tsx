"use client";

import * as React from "react";
import { ChevronDown, Plus, Settings } from "lucide-react";
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
import { Icon } from "@/components/icons";
import Link from "next/link";
// import dynamicIconImports from "lucide-react/dynamicIconImports";
// import { useWorkspaces } from "@/hooks/useWorkspaces";
// import { useUser } from "@/hooks/useUser";
import { useAppRouter } from "@/hooks/use-app-router";
import { useWorkspace } from "@/stores/workspaceStore";

export function WorkspaceSwitcher() {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();
  // const { user } = useUser();
  // const { last_workspace_id } = user || {};
  const { workspaceSlug } = useParams();
  // if workspaces has workspace with slug from params, set it as current workspace
  if (
    workspaceSlug &&
    workspaceSlug !== currentWorkspace?.slug &&
    workspaces.some((w) => w.slug === workspaceSlug)
  ) {
    setCurrentWorkspace(workspaceSlug as string);
  }
  const router = useAppRouter();

  const handleAddWorkspace = React.useCallback(() => {
    router.push("/create-workspace");
  }, [router]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5">
              <div className="flex aspect-square size-5 items-center justify-center rounded-md">
                <Icon
                  name={
                    // (currentWorkspace?.logo as keyof typeof dynamicIconImports) ||
                    "book"
                  }
                  className="size-4"
                />
              </div>
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
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                className="gap-2 p-2"
                asChild
              >
                <Link href={`/${workspace.slug}`}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Icon
                      name={
                        // (workspace.logo as keyof typeof dynamicIconImports)
                        // ||
                        "book"
                      }
                      className="size-4"
                    />
                  </div>
                  {workspace.name}
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
            {/* settings workspace */}
            {
              <DropdownMenuItem
                className="gap-2 p-2"
                onSelect={() => router.push(`${workspaceSlug}/settings`)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Settings className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Settings
                </div>
              </DropdownMenuItem>
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
