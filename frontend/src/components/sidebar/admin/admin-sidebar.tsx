"use client";
import { Home, Users } from "lucide-react";

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
import UserSidebar from "../user-sidebar-footer";
import { ModeToggle } from "../../mode-toggle";
import { NavAdminMain } from "./nav-admin-main";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "admin",
      icon: Home,
    },
    {
      title: "Users management",
      url: "admin/users",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile } = useSidebar();
  const sidebarCollapsed = !isMobile && state === "collapsed";
  return (
    <Sidebar className="border-r-0" {...props} collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-center gap-x-3 gap-y-2">
          {!sidebarCollapsed && <ModeToggle />}
        </div>

        <NavAdminMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent></SidebarContent>

      <SidebarRail />
      <SidebarFooter>
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
