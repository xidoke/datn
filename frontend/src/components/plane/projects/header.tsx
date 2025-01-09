"use client";
import { Briefcase, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { useSidebar } from "@/components/ui/sidebar";

export const ProjectsBaseHeader = () => {
  const { isMobile, toggleSidebar } = useSidebar();
  return (
    <>
      <header className="flex flex-row justify-between bg-background p-2">
        <div className="flex items-center gap-x-2">
          {isMobile && (
            <Menu
              onClick={() => {
                toggleSidebar();
              }}
            />
          )}
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                <div className="flex flex-row items-center justify-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>Projects</span>
                </div>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="flex flex-row space-x-2">
          <div className="relative w-full md:w-64"></div>
          <div className="hidden md:block"></div>
          <CreateProjectDialog>
            <Button size={"sm"}>Add Project</Button>
          </CreateProjectDialog>
        </div>
      </header>
      <Separator className="mb-2" />
    </>
  );
};
