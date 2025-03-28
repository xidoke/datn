"use client";
import ProjectCard from "@/components/projects/project-card";
import { useProject } from "@/stores/projectStore";
import { useParams } from "next/navigation";
import React from "react";

const ProjectsList = () => {
  const { projects } = useProject();
  const params = useParams();

  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            token={project.token || "N/A"}
            description={project.description || "No description provided"}
            createdAt={project.createdAt}
            workspaceSlug={params.workspaceSlug as string}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
