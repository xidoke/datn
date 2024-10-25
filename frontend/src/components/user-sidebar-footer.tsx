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
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { IUser } from "@/types/users";
import { Skeleton } from "./ui/skeleton";

const UserSidebar = ({ user }: { user: IUser | null }) => {
  const router = useRouter();
  const { signOut } = useAuthenticator((context) => [context.user]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.avatar || undefined} />
                <AvatarFallback>
                  <Skeleton className="rounded-full" />
                </AvatarFallback>
              </Avatar>
              {user?.display_name}
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width] text-sidebar-foreground"
          >
            <div className=""></div>
            <h1 className="text-muted-foreground">{user?.email}</h1>
            <DropdownMenuItem>
              <Settings className="mr-2" />
              <span>Setting</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.replace("/v2");
                signOut();
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
