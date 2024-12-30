import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { AuthenticationWrapper } from "@/lib/wrappers/authentication-wrapper";
import WorkspaceWrapper from "../../../layouts/auth-layout/workspace-wrapper";
import { cookies } from "next/headers";

const WorkspaceLayout = async ({
  children,
}: {
  children: ReactNode;
  header: ReactNode;
}) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "false";

  return (
    <AuthenticationWrapper>
      <WorkspaceWrapper>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <main className="relative flex h-full w-full flex-col overflow-hidden bg-backdrop">
            {children}
          </main>
        </SidebarProvider>
      </WorkspaceWrapper>
    </AuthenticationWrapper>
  );
};
export default WorkspaceLayout;
