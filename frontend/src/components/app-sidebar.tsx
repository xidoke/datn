"use client";

import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react";

import { NavFavorites } from "@/components/nav-favorites";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavProjects } from "@/components/nav-projects";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import UserSidebar from "./user-sidebar-footer";
import { useUser } from "@/hooks/useUser";
import { useWorkspaces } from "@/hooks/useWorkspaces";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      title: "Ask AI",
      url: "/ai",
      icon: Sparkles,
    },
    {
      title: "Home",
      url: "#",
      icon: Home,
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
      name: "Project Management & Task Tracking",
      url: "#",
      emoji: "📊",
    },
    {
      name: "Family Recipe Collection & Meal Planning",
      url: "#",
      emoji: "🍳",
    },
    {
      name: "Fitness Tracker & Workout Routines",
      url: "#",
      emoji: "💪",
    },
    {
      name: "Book Notes & Reading List",
      url: "#",
      emoji: "📚",
    },
    {
      name: "Sustainable Gardening Tips & Plant Care",
      url: "#",
      emoji: "🌱",
    },
    {
      name: "Language Learning Progress & Resources",
      url: "#",
      emoji: "🗣️",
    },
    {
      name: "Home Renovation Ideas & Budget Tracker",
      url: "#",
      emoji: "🏠",
    },
    {
      name: "Personal Finance & Investment Portfolio",
      url: "#",
      emoji: "💰",
    },
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
  const { user } = useUser();
  const { workspaces, isLoading, isError } = useWorkspaces();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading workspaces</div>;

  const activeWorkspaceId = user?.last_workspace_id || workspaces[0]?.id;

  const navSecondary = [
    {
      title: "Calendar",
      url: `#`,
      icon: Calendar,
    },
    {
      title: "Settings",
      url: `/v2/${activeWorkspaceId}/settings/general`,
      icon: Settings2,
    },
    {
      title: "Templates",
      url: "#",
      icon: Blocks,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ];

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        {activeWorkspaceId && <NavProjects workspaceId={activeWorkspaceId} />}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <UserSidebar />
      </SidebarFooter>
    </Sidebar>
  );
}
