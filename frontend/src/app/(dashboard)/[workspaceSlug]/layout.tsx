import { AppSidebar } from "@/components/workspaces/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { AuthenticationWrapper } from "@/lib/wrappers/authentication-wrapper";
import WorkspaceWrapper from "./workspace-wrapper";

const WorkspaceLayout = ({
  children,
}: {
  children: ReactNode;
  header: ReactNode;
}) => {
  return (
    <AuthenticationWrapper>
      <WorkspaceWrapper>
        <SidebarProvider>
          <AppSidebar />
          <main className="relative flex h-full w-full flex-col overflow-hidden">
            {children}
          </main>
        </SidebarProvider>
      </WorkspaceWrapper>
    </AuthenticationWrapper>
  );
};
export default WorkspaceLayout;
