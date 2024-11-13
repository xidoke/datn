"use client";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
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
import { useProject } from "@/stores/projectStore";
import { useParams } from "next/navigation";

const HeaderLeft = () => {
  const { workspaceSlug, projectId } = useParams();
  const { getProjectById } = useProject();
  const project = getProjectById(projectId as string);
  return (
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
  );
};

const HeaderRight = () => {
  return (
    <div>
        <Button size={"sm"}>Add Issue</Button>
    </div>
  );
};

const ProjectDetailsHeader = () => {
  return (
    <>
      <Header left={<HeaderLeft />} right={<HeaderRight />} />
    </>
  );
};
export default ProjectDetailsHeader;
