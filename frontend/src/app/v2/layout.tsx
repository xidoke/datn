import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AuthProvider from "../authProvider";

const LayoutV2 = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full px-5 py-2">
          <div className="flex w-full justify-between border-b-2">
            <SidebarTrigger />
            <ModeToggle />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
};
export default LayoutV2;
