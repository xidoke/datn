"use client";
import { ChevronUp, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useAppRouter } from "@/hooks/use-app-router";
import { useUser } from "@/stores/userStore";
import { API_BASE_URL } from "@/helpers/common.helper";

const UserSidebar = () => {
  const {
    logout
  } = useAuth();
  const {data: user} = useUser();
  const router = useAppRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={`${API_BASE_URL}${user?.avatarUrl}` || "/image/user.jpg"}
                />
                <AvatarFallback>
                  <Skeleton className="rounded-full" />
                </AvatarFallback>
              </Avatar>
              {`${user?.firstName} ${user?.lastName}`}
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width] text-sidebar-foreground"
          >
            <div className=""></div>
            <h1 className="text-muted-foreground">{user?.email}</h1>
            <DropdownMenuItem
              onClick={() => {
                router.replace("/profile");
              }}
            >
              <Settings className="mr-2" />
              <span>Setting</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
export default UserSidebar;
