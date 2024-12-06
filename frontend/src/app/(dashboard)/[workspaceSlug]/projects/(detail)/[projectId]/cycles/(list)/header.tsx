/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CreateCycleModal from "@/components/cycle/modal";
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
import { useToast } from "@/hooks/use-toast";
import { useCycleStore } from "@/stores/cycleStore";
import { useProject } from "@/stores/projectStore";
import { RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

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
          <BreadcrumbPage>
            <div className="flex text-sm justify-center items-center">
              <RefreshCcw size={12} />
              &nbsp;Cycles
            </div>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const HeaderRight = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const { projectId, workspaceSlug } = useParams();
  const { getProjectById } = useProject();
  const { toast } = useToast();
  const currentProjectDetails = getProjectById(projectId as string);

  const { createCycle } = useCycleStore();
    const handleCreateCycle = async (data: {
      title: string;
      description?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      // Here you would typically send this data to your backend or state management system
      try {
        await createCycle(workspaceSlug as string, projectId as string, data)
        toast({
          title: "Success",
          description: "success create a new cycle",
          variant: "default",
        });
      } catch (error: any) {
        
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      // You might want to update your local state or fetch updated data here
    };
  return (
    <div className="flex gap-2">
      {/* <HeaderFilters currentProjectDetails={currentProjectDetails} /> */}
      <Button size={"sm"} onClick={handleOpenModal}>
        Add Cycle
      </Button>
      <CreateCycleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateCycle}
      />
    </div>
  );
};

const CycleListHeader = () => {
  return (
    <>
      <Header left={<HeaderLeft />} right={<HeaderRight />} />
    </>
  );
};
export default CycleListHeader;
