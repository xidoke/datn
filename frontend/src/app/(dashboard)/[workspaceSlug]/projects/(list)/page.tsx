"use client";
import { useProject } from "@/stores/projectStore";
import { ProjectCard } from "@/components/projects/project-card";
import { useParams } from "next/navigation";
import { ContentWrapper } from "@/components/content-wrapper";

const ListProjectPage = () => {
  const { projects } = useProject();
  const params = useParams();
  return (
    <>
      <ContentWrapper>
        <div className="ml-4 mt-4 flex flex-row flex-wrap gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              identifier={"HElLO"} // TODO: Fix this
              createdAt={project.createdAt}
              workspaceSlug={params.workspaceSlug as string}
            />
          ))}
        </div>
      </ContentWrapper>
    </>
  );
};
export default ListProjectPage;
