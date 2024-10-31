import useSWR from "swr";
import { useProjectStore } from "@/store/projectStore";
import { useCallback, useEffect } from "react";
import { IProject } from "@/types/project";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetcher = async (url: string): Promise<IProject[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the projects.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export function useProjects(workspaceId: string) {
  const {
    data: projects,
    error,
    isLoading,
    mutate,
  } = useSWR<IProject[]>(
    `${API_BASE_URL}/api/workspaces/${workspaceId}/projects`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const setProjects = useProjectStore((state) => state.setProjects);

  useEffect(() => {
    if (projects) setProjects(projects);
  }, [projects, setProjects]);

  const addProject = useCallback(
    async (newProject: Omit<IProject, "id">) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/workspaces/${workspaceId}/projects`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProject),
          },
        );
        if (!response.ok) throw new Error("Failed to add project");
        const addedProject: IProject = await response.json();
        mutate(
          (currentProjects) => [...(currentProjects || []), addedProject],
          false,
        );
        return addedProject;
      } catch (error) {
        console.error("Error adding project:", error);
        throw error;
      }
    },
    [workspaceId, mutate],
  );

  const updateProject = useCallback(
    async (updatedProject: IProject) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/projects/${updatedProject.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProject),
          },
        );
        if (!response.ok) throw new Error("Failed to update project");
        const updated: IProject = await response.json();
        mutate(
          (currentProjects) =>
            currentProjects?.map((p) => (p.id === updated.id ? updated : p)) ||
            [],
          false,
        );
        return updated;
      } catch (error) {
        console.error("Error updating project:", error);
        throw error;
      }
    },
    [mutate],
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/projects/${projectId}`,
          {
            method: "DELETE",
          },
        );
        if (!response.ok) throw new Error("Failed to delete project");
        mutate(
          (currentProjects) =>
            currentProjects?.filter((p) => p.id !== projectId) || [],
          false,
        );
      } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
      }
    },
    [mutate],
  );

  return {
    projects: projects || [],
    isLoading,
    isError: !!error,
    error,
    addProject,
    updateProject,
    deleteProject,
    mutate,
  };
}
