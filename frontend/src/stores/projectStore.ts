import { Project } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/api/api-client";

interface ProjectState {
  loader: boolean;
  projects: Project[];
  currentProjectDetails: Project | undefined;
}

interface ProjectActions {
  getProjectById: (projectId: string | undefined | null) => Project | undefined;
  fetchProjects: (workspaceSlug: string) => Promise<Project[]>;
  fetchProjectDetails: (
    workspaceSlug: string,
    projectId: string,
  ) => Promise<Project>;
  createProject: (
    workspaceSlug: string,
    data: Partial<Project>,
  ) => Promise<Project>;
  updateProject: (
    workspaceSlug: string,
    projectId: string,
    data: Partial<Project>,
  ) => Promise<Project>;
  deleteProject: (workspaceSlug: string, projectId: string) => Promise<void>;
}

export type ProjectStore = ProjectState & ProjectActions;

const initialState: ProjectState = {
  loader: false,
  projects: [],
  currentProjectDetails: undefined,
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      getProjectById: (projectId) => {
        if (!projectId) return undefined;
        return get().projects.find((project) => project.id === projectId);
      },

      fetchProjects: async (workspaceSlug) => {
        set({ loader: true });
        try {
          const response = await apiClient.get<Project[]>(
            `/workspaces/${workspaceSlug}/projects`,
          );
          set({ projects: response, loader: false });
          return response;
        } catch (error) {
          set({ loader: false });
          throw error;
        }
      },

      fetchProjectDetails: async (workspaceSlug, projectId) => {
        set({ loader: true });
        try {
          const response = await apiClient.get<Project>(
            `/workspaces/${workspaceSlug}/projects/${projectId}`,
          );
          set({ currentProjectDetails: response, loader: false });
          return response;
        } catch (error) {
          set({ loader: false });
          throw error;
        }
      },

      createProject: async (workspaceSlug, data) => {
        set({ loader: true });
        try {
          const response = await apiClient.post<Project>(
            `/workspaces/${workspaceSlug}/projects`,
            data,
          );
          set((state) => ({
            projects: [...state.projects, response],
            loader: false,
          }));
          return response;
        } catch (error) {
          set({ loader: false });
          throw error;
        }
      },

      updateProject: async (workspaceSlug, projectId, data) => {
        set({ loader: true });
        try {
          const response = await apiClient.patch<Project>(
            `/workspaces/${workspaceSlug}/projects/${projectId}`,
            data,
          );
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId ? response : project,
            ),
            currentProjectDetails: response,
            loader: false,
          }));
          return response;
        } catch (error) {
          set({ loader: false });
          throw error;
        }
      },

      deleteProject: async (workspaceSlug, projectId) => {
        set({ loader: true });
        try {
          await apiClient.delete(
            `/workspaces/${workspaceSlug}/projects/${projectId}`,
          );
          set((state) => ({
            projects: state.projects.filter(
              (project) => project.id !== projectId,
            ),
            currentProjectDetails:
              state.currentProjectDetails?.id === projectId
                ? undefined
                : state.currentProjectDetails,
            loader: false,
          }));
        } catch (error) {
          set({ loader: false });
          throw error;
        }
      },
    }),
    {
      name: "project-storage",
    },
  ),
);


export const useProject = () => useProjectStore((state) => state); 