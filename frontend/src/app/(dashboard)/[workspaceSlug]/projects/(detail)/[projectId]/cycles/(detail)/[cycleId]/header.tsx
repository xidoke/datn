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
import { useProjectStore } from "@/stores/projectStore";
import { useCycleStore } from "@/stores/cycleStore";


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
            <BreadcrumbPage>{currentCycleDetails?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

const HeaderRight = () => {
    return (
         <Button
        onClick={() => {
          // Add logic to edit cycle here
          console.log("Edit cycle");
        }}
      >
        Edit Cycle
      </Button>
    )
}
export const CycleLayoutHeader: FC = () => {

  return (
    <Header right={<HeaderRight/>} left={<HeaderLeft/>}/>
  );
};
