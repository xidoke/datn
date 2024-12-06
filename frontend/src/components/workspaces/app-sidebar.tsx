"use client";
import { Home, Projector, Settings2, StickyNote } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { WorkspaceSwitcher } from "@/components/workspaces/workspace-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import UserSidebar from "../user-sidebar-footer";
import { NavProjects } from "../nav-projects";
import { ModeToggle } from "../mode-toggle";

const data = {
  navMain: [
    {
      title: "Home",
      url: "",
      icon: Home,
      // isActive: true,
    },
    {
      title: "Projects",
      url: "projects",
      icon: StickyNote,
      // isActive: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navSecondary = [
    {
      title: "Settings",
      url: "settings",
      icon: Settings2,
    },
  ];
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex flex-row">
          <WorkspaceSwitcher />
          <ModeToggle />
        </div>

        <NavMain items={data.navMain}/>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <UserSidebar />
      </SidebarFooter>
    </Sidebar>
  );
}
