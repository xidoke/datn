"use client";
import { Home, Inbox, Projector, Settings2, Sparkles } from "lucide-react";

// import { NavFavorites } from "@/components/nav-favorites";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
// import { NavProjects } from "@/components/nav-projects";
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

// This is sample data.
const data = {
  navMain: [
    // {
    //   title: "Search",
    //   url: "/search",
    //   icon: Search,
    // },
    {
      title: "Ask AI",
      url: "/ai",
      icon: Sparkles,
    },
    {
      title: "Home",
      url: "",
      icon: Home,
      // isActive: true,
    },
    {
      title: "Projects",
      url: "projects",
      icon: Projector,
      // isActive: true,
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: Inbox,
      badge: "10",
    },
  ],
  favorites: [
    {
      name: "Movie & TV Show Watchlist with Reviews",
      url: "#",
      emoji: "🎬",
    },
    {
      name: "Daily Habit Tracker & Goal Setting",
      url: "#",
      emoji: "✅",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navSecondary = [
    // {
    //   title: "Calendar",
    //   url: `#`,
    //   icon: Calendar,
    // },
    {
      title: "Settings",
      url: "settings",
      icon: Settings2,
    },
    // {
    //   title: "Templates",
    //   url: "#",
    //   icon: Blocks,
    // },
    // {
    //   title: "Trash",
    //   url: "#",
    //   icon: Trash2,
    // },
    // {
    //   title: "Help",
    //   url: "#",
    //   icon: MessageCircleQuestion,
    // },
  ];
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex flex-row">
          <WorkspaceSwitcher />
          <ModeToggle />
        </div>

        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavFavorites favorites={data.favorites} /> */}
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
