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
import { useProjectStore } from "@/stores/projectStore";
import { Menu, Settings } from "lucide-react";
import { useParams } from "next/navigation";

const HeaderLeft = () => {
  const { workspaceSlug, projectId } = useParams();
  const { currentProjectDetails } = useProjectStore();
  const { isMobile, toggleSidebar } = useSidebar();
  return (
    <>
      {isMobile && <Menu onClick={() => toggleSidebar()} />}

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${workspaceSlug}/projects/${projectId}`}>
              {currentProjectDetails?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Settings size={16} />
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

const SettingProjectHeader = () => {
  return (
    <>
      <Header left={<HeaderLeft />} />
    </>
  );
};

export default SettingProjectHeader;
