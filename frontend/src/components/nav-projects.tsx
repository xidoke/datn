"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ChevronRight,
  MoreHorizontal,
  Folder,
  Settings,
  RefreshCcw,
  CheckSquare2,
  Plus,
} from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
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
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useReducer } from "react";
import { CreateProjectDialog } from "./projects/create-project-dialog";

const projectSubItems = [
  { name: "Issues", icon: CheckSquare2, href: "issues" },
  { name: "Cycles", icon: RefreshCcw, href: "cycles" },
];

const expandedSubItems = [
  { name: "Settings", icon: Settings, href: "settings" },
];

// Reducer để quản lý trạng thái mở/đóng
const projectReducer = (state: any, action: any) => {
  switch (action.type) {
    case "TOGGLE_PROJECT":
      return {
        ...state,
        [action.projectId]: !state[action.projectId],
      };
    case "RESET_PROJECTS":
      return {};
    default:
      return state;
  }
};

export function NavProjects() {
  const { workspaceSlug } = useParams();
  const { projects, isLoading } = useProjectStore();
  const pathname = usePathname();

  const { state, isMobile } = useSidebar();
  const sidebarCollapsed = !isMobile && state === "collapsed";

  // Sử dụng reducer để quản lý trạng thái
  const [openProjects, dispatch] = useReducer(projectReducer, {});

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold">
        YOUR PROJECTS
      </SidebarGroupLabel>
      <SidebarGroupAction title="Add Project">
        <CreateProjectDialog>
          <Plus size={16} /> <span className="sr-only">Add Project</span>
        </CreateProjectDialog>
      </SidebarGroupAction>
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
              <SidebarMenuButton>
                <CreateProjectDialog className="h-full w-full text-left">
                  Add project
                </CreateProjectDialog>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            projects.map((project) => (
              <Collapsible
                key={project.id}
                className="group/collapsible"
                open={!!openProjects[project.id]}
                onOpenChange={() =>
                  dispatch({ type: "TOGGLE_PROJECT", projectId: project.id })
                }
              >
                <SidebarMenuItem>
                  <div className="flex w-full items-center">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton title={`${project.name}`}>
                        <Link
                          href={`/${workspaceSlug}/projects/${project.id}/issues`}
                          className="flex w-full max-w-[85%] items-center"
                          onClick={() => {
                            dispatch({
                              type: "RESET_PROJECTS",
                              projectId: project.id,
                            });
                            dispatch({
                              type: "TOGGLE_PROJECT",
                              projectId: project.id,
                            });
                          }}
                        >
                          <Folder className="h-4 w-4" />
                          {!sidebarCollapsed && (
                            <span className="ml-2 truncate">
                              {project.name}
                            </span>
                          )}
                        </Link>
                        {!sidebarCollapsed && (
                          <ChevronRight
                            className={`transition-transform ${
                              openProjects[project.id] ? "rotate-90" : ""
                            }`}
                          />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <DropdownMenu>
                      {!sidebarCollapsed && (
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton className="w-fit data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Project options</span>
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                      )}
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
                    <SidebarMenu className="border-none">
                      {projectSubItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={pathname.includes(
                              `${project.id}/${item.href}`,
                            )}
                          >
                            <Link
                              href={`/${workspaceSlug}/projects/${project.id}/${item.href}`}
                              className="flex items-center gap-2"
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
