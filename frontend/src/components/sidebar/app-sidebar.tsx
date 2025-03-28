"use client";
import { Briefcase, Home, Inbox, Settings, Users } from "lucide-react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { WorkspaceSwitcher } from "@/components/workspaces/workspace-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import UserSidebar from "./user-sidebar-footer";
import { NavProjects } from "./nav-projects";
import { ModeToggle } from "../mode-toggle";

const data = {
  navMain: [
    {
      title: "Home",
      url: "",
      icon: Home,
    },
    {
      title: "Team",
      url: "team",
      icon: Users,
    },
    {
      title: "Inbox",
      url: "inbox",
      icon: Inbox,
    },
    {
      title: "Projects",
      url: "projects",
      icon: Briefcase,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navSecondary = [
    {
      title: "Settings",
      url: "settings",
      icon: Settings,
    },
  ];
  const { state, isMobile } = useSidebar();
  const sidebarCollapsed = !isMobile && state === "collapsed";
  return (
    <Sidebar className="border-r-0" {...props} collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-center gap-x-3 gap-y-2">
          <WorkspaceSwitcher />
          {!sidebarCollapsed && <ModeToggle />}
        </div>

        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavProjects />
      </SidebarContent>

      <SidebarRail />
      <SidebarFooter>
        <NavSecondary items={navSecondary} />
        <SidebarSeparator />
        <div className="flex items-center justify-center gap-x-3">
          <UserSidebar />
          {!sidebarCollapsed && (
            <SidebarMenu className="w-fit">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <SidebarTrigger />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </div>

        {sidebarCollapsed && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <SidebarTrigger />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
