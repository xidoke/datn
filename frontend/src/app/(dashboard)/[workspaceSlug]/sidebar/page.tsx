"use client";

import { useSidebar, SidebarTrigger} from "@/components/ui/sidebar";

const Page = () => {
  
  const { open } = useSidebar();
  return (
    <div>
      <div>isOpen: {open ? "true" : "false"}</div>
      <SidebarTrigger/>
    </div>
  );
};
export default Page;
