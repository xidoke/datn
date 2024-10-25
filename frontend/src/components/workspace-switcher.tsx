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
import { useParams } from "next/navigation";
import { Icon } from "./icons";
import Link from "next/link";
import { IWorkspaceLite } from "@/types/workspace";
import dynamicIconImports from "lucide-react/dynamicIconImports";

export function WorkspaceSwitcher({
  workspaces,
}: {
  workspaces: IWorkspaceLite[]; // Chỉ cần thông tin lite ở đây nếu không cần nhiều chi tiết.
}) {
  // Sử dụng `IWorkspaceLite | null` để xử lý khởi tạo an toàn.
  const [activeWorkspace, setActiveWorkspace] =
    React.useState<IWorkspaceLite | null>(null);
  const { workspaceId } = useParams();

  React.useEffect(() => {
    if (workspaceId) {
      const workspace = workspaces?.find(
        (workspace) => workspace.id === workspaceId,
      );
      if (workspace) {
        setActiveWorkspace(workspace);
      } else {
        setActiveWorkspace(null); // Reset nếu không tìm thấy workspace.
      }
    }
  }, [workspaceId, workspaces]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5">
              <div className="flex aspect-square size-5 items-center justify-center rounded-md">
                <Icon
                  name={
                    (activeWorkspace?.logo as keyof typeof dynamicIconImports) ||
                    "book"
                  }
                  className="size-4"
                />
              </div>
              <span className="truncate font-semibold">
                {activeWorkspace ? activeWorkspace.name : "Select Workspace"}
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
                <Link href={`/v2/${workspace.id}`}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Icon
                      name={
                        (workspace?.logo as keyof typeof dynamicIconImports) ||
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
            <DropdownMenuItem className="gap-2 p-2">
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
