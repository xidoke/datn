import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Header } from "@/components/ui/header";
import { useSidebar } from "@/components/ui/sidebar";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { Menu, Settings } from "lucide-react";
import { useParams } from "next/navigation";
const HeaderLeft = () => {
  const { workspaceSlug } = useParams();
  const { getWorkspaceBySlug } = useWorkspaceStore();
  const workspace = getWorkspaceBySlug(workspaceSlug as string);

  const { isMobile, toggleSidebar } = useSidebar();
  return (
    <>
      {isMobile && (
        <Menu
          onClick={() => {
            toggleSidebar();
          }}
        />
      )}
      <Settings size={16} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/`}>{workspace?.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Teams</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

const TeamWorkspaceHeader = () => {
  return (
    <>
      <Header left={<HeaderLeft />} />
    </>
  );
};
export default TeamWorkspaceHeader;
