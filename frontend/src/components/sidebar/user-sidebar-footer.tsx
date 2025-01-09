"use client";
import { ChevronUp, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppRouter } from "@/hooks/use-app-router";
import { useUser } from "@/stores/userStore";
import { API_BASE_URL } from "@/helpers/common.helper";
import { useLogout } from "@/hooks/useLogout";

const UserSidebar = () => {
  const logout = useLogout();
  const { data: user } = useUser();
  const router = useAppRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="truncate">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={`${API_BASE_URL}${user?.avatarUrl}` || "/image/user.jpg"}
                />
                <AvatarFallback>
                  {(user?.firstName?.charAt(0).toUpperCase() ??
                    "" + user?.lastName?.charAt(0).toUpperCase() ??
                    "") ||
                    user?.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{`${user?.firstName} ${user?.lastName}`}</span>
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
            <DropdownMenuItem
              onClick={async () => {
                await logout();
                router.replace("/");
              }}
            >
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
