import { ReactNode } from "react";
import { AuthenticationWrapper } from "@/lib/wrappers/authentication-wrapper";
import { PageType } from "@/helpers/authentication.helper";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/admin/admin-sidebar";
import { cookies } from "next/headers";

const WorkspaceLayout = async ({ children }: { children: ReactNode }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "false";

  return (
    <AuthenticationWrapper pageType={PageType.ADMIN}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="relative flex h-full w-full flex-col overflow-hidden bg-backdrop">
          {children}
        </main>
      </SidebarProvider>
    </AuthenticationWrapper>
  );
};
export default WorkspaceLayout;
