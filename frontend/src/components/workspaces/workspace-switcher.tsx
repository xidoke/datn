"use client";

import * as React from "react";
import { ChevronDown, Plus } from "lucide-react";
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
import { useParams, usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import Link from "next/link";
import dynamicIconImports from "lucide-react/dynamicIconImports";
// import { useWorkspaces } from "@/hooks/useWorkspaces";
// import { useUser } from "@/hooks/useUser";
import { useAppRouter } from "@/hooks/use-app-router";

export function WorkspaceSwitcher() {
  // const { workspaces = [] } = useWorkspaces();
  // const { user } = useUser();
  // const { last_workspace_id } = user || {};
  // const { workspaceId } = useParams();
  const router = useAppRouter();
  // const pathname = usePathname();

  // const activeWorkspace = React.useMemo(() => {
  //   if (workspaceId) {
  //     return (
  //       workspaces.find((workspace) => workspace.id === workspaceId) || null
  //     );
  //   }
  //   if (last_workspace_id) {
  //     return (
  //       workspaces.find((workspace) => workspace.id === last_workspace_id) ||
  //       null
  //     );
  //   }
  //   return workspaces[0] || null;
  // }, [workspaces, workspaceId, last_workspace_id]);

  // React.useEffect(() => {
  //   if (pathname === "/") {
  //     if (activeWorkspace) {
  //       router.push(`/${activeWorkspace.id}`);
  //     } else if (workspaces.length === 0) {
  //       router.push("/create-workspace");
  //     }
  //   }
  // }, [pathname, activeWorkspace, workspaces.length, router]);

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
                {/* <Icon
                  name={
                    (activeWorkspace?.logo as keyof typeof dynamicIconImports) ||
                    "book"
                  }
                  className="size-4"
                /> */}
              </div>
              <span className="truncate font-semibold">
                {/* {activeWorkspace?.name || "Select Workspace"} */}
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
            {/* {workspaces.map((workspace: IWorkspaceLite) => (
              <DropdownMenuItem
                key={workspace.id}
                className="gap-2 p-2"
                asChild
              >
                <Link href={`/${workspace.id}`}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Icon
                      name={
                        (workspace.logo as keyof typeof dynamicIconImports) ||
                        "book"
                      }
                      className="size-4"
                    />
                  </div>
                  {workspace.name}
                </Link>
              </DropdownMenuItem>
            ))} */}
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
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
