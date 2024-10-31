"use client";

import Link from "next/link";
import {
  ChevronDown,
  MoreHorizontal,
  Plus,
  Folder,
  Layout,
  Settings,
  Clock,
  Layers,
  View,
  FileText,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function NavProjects({ workspaceId }: { workspaceId: string }) {
  const { projects, isLoading, isError } = useProjects(workspaceId);

  if (isLoading) return <div>Loading projects...</div>;
  if (isError) return <div>Error loading projects</div>;

  const projectSubItems = [
    { name: "Issues", icon: Layout, href: "issues" },
    { name: "Cycles", icon: Clock, href: "cycles" },
    { name: "Modules", icon: Layers, href: "modules" },
    { name: "Views", icon: View, href: "views" },
    { name: "Pages", icon: FileText, href: "pages" },
  ];

  const expandedSubItems = [
    { name: "Board View", icon: Layout, href: "board" },
    { name: "List View", icon: Layout, href: "list" },
    { name: "Settings", icon: Settings, href: "settings" },
  ];

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between px-2">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <Link
          href={`/v2/${workspaceId}/projects/new`}
          className="rounded-md p-1 hover:bg-muted"
        >
          <Plus className="h-4 w-4" />
        </Link>
      </div>
      <SidebarGroupContent>
        <SidebarMenu>
          {projects.map((project) => (
            <Collapsible key={project.id}>
              <SidebarMenuItem className="group">
                <div className="flex w-full items-center">
                  <CollapsibleTrigger asChild>
                    <button className="mr-1 flex h-6 w-6 items-center justify-center rounded hover:bg-muted">
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  <SidebarMenuButton asChild className="flex-1">
                    <Link
                      href={`/v2/${workspaceId}/projects/${project.id}`}
                      className="flex items-center gap-2"
                    >
                      <Folder className="h-4 w-4 text-primary" />
                      <span className="truncate">{project.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="ml-auto flex h-6 w-6 items-center justify-center rounded opacity-0 hover:bg-muted group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="right">
                      {expandedSubItems.map((item) => (
                        <DropdownMenuItem key={item.href}>
                          <Link
                            href={`/v2/${workspaceId}/projects/${project.id}/${item.href}`}
                            className="flex items-center gap-2"
                          >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {projectSubItems.map((item) => (
                      <SidebarMenuSubItem key={item.href}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={`/v2/${workspaceId}/projects/${project.id}/${item.href}`}
                            className="flex items-center gap-2"
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
          <SidebarMenuItem>
            <Link
              href={`/v2/${workspaceId}/projects`}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span>All Projects</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
