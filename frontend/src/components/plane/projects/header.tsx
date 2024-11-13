"use client";

// import { useProjectFilter } from "@/hooks/store";
import HeaderFilters from "./filters";
import { Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export const ProjectsBaseHeader = () => {
  // const { searchQuery, updateSearchQuery } = useProjectFilter();

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      // updateSearchQuery("");
    }
  };

  return (
    <>
      <header className="flex flex-row justify-between p-2">
        <div className="flex items-center">
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
          <div className="relative w-full md:w-64">
            <Input
              className="w-full"
              placeholder="Search projects"
              // value={searchQuery}
              // onChange={(e) => updateSearchQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          </div>
          <div className="hidden md:block">
            <HeaderFilters />
          </div>
          <Button
            onClick={() => {
              // TO DO: Add project
            }}
          >
            <span className="hidden sm:inline-block">Add</span> Project
          </Button>
        </div>
      </header>
      <Separator className="mb-2" />
    </>
  );
};
