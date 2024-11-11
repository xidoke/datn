"use client";
import { useProject } from "@/stores/projectStore";
import ListProjectHeader from "./header";
import { ProjectCard } from "@/components/projects/project-card";
import { useParams } from "next/navigation";

const ListProjectPage = () => {
  const { projects } = useProject();
  const params = useParams();
  return (
    <>
      <ListProjectHeader />
      <div className="ml-4 mt-4 flex flex-row flex-wrap gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            identifier={"HElLO"}
            createdAt={project.createdAt}
            workspaceSlug={params.workspaceSlug as string}
          />
        ))}
      </div>
    </>
  );
};
export default ListProjectPage;
