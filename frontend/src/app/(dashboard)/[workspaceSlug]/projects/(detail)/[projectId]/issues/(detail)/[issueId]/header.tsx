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
import useIssueStore from "@/stores/issueStore";
import { useProject } from "@/stores/projectStore";
import { Menu } from "lucide-react";
import { useParams } from "next/navigation";

const HeaderLeft = () => {
  const { workspaceSlug, projectId, issueId} = useParams();
  const { getProjectById } = useProject();
  const { getIssueById } = useIssueStore();
  const issue = getIssueById(issueId as string);
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
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{issue?.fullIdentifier ?? issue?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};


const IssueDetailsHeader = () => {
  return (
    <>
      <Header left={<HeaderLeft />}/>
    </>
  );
};
export default IssueDetailsHeader;
