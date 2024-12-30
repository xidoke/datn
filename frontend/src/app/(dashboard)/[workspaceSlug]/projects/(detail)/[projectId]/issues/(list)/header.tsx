"use client";
import { CreateIssueDialog } from "@/components/issues/create-issue-dialog";
import HeaderFilters from "@/components/issues/filter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { useSidebar } from "@/components/ui/sidebar";
import { useProject } from "@/stores/projectStore";
import { Menu } from "lucide-react";
import { useParams } from "next/navigation";

const HeaderLeft = () => {
  const { workspaceSlug, projectId } = useParams();
  const { getProjectById } = useProject();
  const project = getProjectById(projectId as string);
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${workspaceSlug}/projects`}>
              {project?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Issues</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

const HeaderRight = () => {
  const { projectId } = useParams();
  const { getProjectById } = useProject();
  const currentProjectDetails = getProjectById(projectId as string);
  return (
    <div className="flex gap-2">
      <HeaderFilters currentProjectDetails={currentProjectDetails} />

      <CreateIssueDialog>
        <Button size={"sm"}>Add Issue</Button>
      </CreateIssueDialog>
    </div>
  );
};

const IssueListHeader = () => {
  return (
    <>
      <Header left={<HeaderLeft />} right={<HeaderRight />} />
    </>
  );
};
export default IssueListHeader;
