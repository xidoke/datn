"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronDown,
  MoreHorizontal,
  Folder,
  Layout,
  Settings,
} from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { CreateProjectDialog } from "./projects/create-project-dialog";

const projectSubItems = [{ name: "Issues", icon: Layout, href: "issues" }];

const expandedSubItems = [
  { name: "Settings", icon: Settings, href: "settings" },
];

export function NavProjects() {
  const { workspaceSlug } = useParams();
  const { projects, loader: isLoading } = useProjectStore();

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between px-2">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <Button variant="ghost" size="icon" asChild className="h-6 w-6">
          <CreateProjectDialog />
        </Button>
      </div>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <SidebarMenuItem key={index}>
                  <Skeleton className="h-6 w-full" />
                </SidebarMenuItem>
              ))
          ) : projects.length === 0 ? (
            <SidebarMenuItem>
              <div className="text-sm text-muted-foreground">
                No projects found
              </div>
            </SidebarMenuItem>
          ) : (
            projects.map((project) => (
              <Collapsible key={project.id}>
                <SidebarMenuItem className="group">
                  <div className="flex w-full items-center">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0"
                      >
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        <span className="sr-only">Toggle project menu</span>
                      </Button>
                    </CollapsibleTrigger>
                    <SidebarMenuButton asChild className="flex-1">
                      <Link
                        href={`/${workspaceSlug}/projects/${project.id}/issues`}
                        className="flex items-center gap-2 px-2"
                      >
                        <Folder className="h-4 w-4 text-primary" />
                        <span className="truncate">{project.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Project options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" side="right">
                        {expandedSubItems.map((item) => (
                          <DropdownMenuItem key={item.href} asChild>
                            <Link
                              href={`/${workspaceSlug}/projects/${project.id}/${item.href}`}
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
                              href={`/${workspaceSlug}/projects/${project.id}/${item.href}`}
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
            ))
          )}
          <SidebarMenuItem>
            <Link
              href={`/${workspaceSlug}/projects`}
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
