"use client";

import { FC } from "react";
import { useParams } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { Header } from "@/components/ui/header";
// shadcn components
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// hooks
import { useAppRouter } from "@/hooks/use-app-router";
import { useProject, useProjectStore } from "@/stores/projectStore";
import { useCycleStore } from "@/stores/cycleStore";
import HeaderFilters from "@/components/issues/filter";
import { CreateIssueDialog } from "@/components/issues/create-issue-dialog";


const HeaderLeft = () => {
  // router
  const router = useAppRouter();
  const { workspaceSlug, cycleId, projectId } = useParams();

  const { currentProjectDetails, isLoading } = useProjectStore();
  const { getCycleById } = useCycleStore();
  const currentCycleDetails = getCycleById(cycleId as string);

  return (
    <div className="flex items-center space-x-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${workspaceSlug}/projects`}>
              {currentProjectDetails?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/${workspaceSlug}/projects/{projectId}/cycles/`}
            >
              <div className="flex items-center justify-center text-sm">
                <RefreshCcw size={12} />
                &nbsp;Cycles
              </div>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentCycleDetails?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

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
}
export const CycleLayoutHeader: FC = () => {

  return (
    <Header right={<HeaderRight/>} left={<HeaderLeft/>}/>
  );
};
