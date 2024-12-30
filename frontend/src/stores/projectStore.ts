import { Project } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProjectService } from "@/services/project.service";

interface ProjectState {
  isLoading: boolean;
  error: string | undefined;
  projects: Project[];
  currentProjectDetails: Project | undefined;
}

interface ProjectActions {
  getProjectById: (projectId: string | undefined | null) => Project | undefined;
  fetchProjects: (workspaceSlug: string) => Promise<Project[]>;
  fetchProjectDetails: (workspaceSlug: string, projectId: string) => Promise<Project>;
  createProject: (workspaceSlug: string, data: Partial<Project>) => Promise<Project>;
  updateProject: (workspaceSlug: string, projectId: string, data: Partial<Project>) => Promise<Project>;
  deleteProject: (workspaceSlug: string, projectId: string) => Promise<void>;
  reset: () => void;
}

export type ProjectStore = ProjectState & ProjectActions;

const initialState: ProjectState = {
  isLoading: false,
  error: undefined,
  projects: [],
  currentProjectDetails: undefined,
};

const projectService = new ProjectService();

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      getProjectById: (projectId) => {
        if (!projectId) return undefined;
        return get().projects.find((project) => project.id === projectId);
      },

      fetchProjects: async (workspaceSlug) => {
        set({ isLoading: true, error: undefined });
        try {
          const result = await projectService.fetchProjects(workspaceSlug);
          const projects = result.data;
          set({ projects, isLoading: false });
          return projects;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch projects";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      fetchProjectDetails: async (workspaceSlug, projectId) => {
        set({ isLoading: true, error: undefined });
        try {
          const result = await projectService.fetchProjectDetails(workspaceSlug, projectId);
          const project = result.data;
          set({ currentProjectDetails: project, isLoading: false });
          return project;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch project details";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      createProject: async (workspaceSlug, data) => {
        set({ isLoading: true, error: undefined });
        try {
          const result = await projectService.createProject(workspaceSlug, data);
          const newProject = result.data;
          set((state) => ({
            projects: [...state.projects, newProject],
            isLoading: false,
          }));
          return newProject;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to create project";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      updateProject: async (workspaceSlug, projectId, data) => {
        set({ isLoading: true, error: undefined });
        try {
          const result = await projectService.updateProject(workspaceSlug, projectId, data);
          const updatedProject = result.data;
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId ? updatedProject : project
            ),
            currentProjectDetails: updatedProject,
            isLoading: false,
          }));
          return updatedProject;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update project";
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      deleteProject: async (workspaceSlug, projectId) => {
        set({ isLoading: true, error: undefined });
        try {
          await projectService.deleteProject(workspaceSlug, projectId);
          set((state) => ({
            projects: state.projects.filter((project) => project.id !== projectId),
            currentProjectDetails:
              state.currentProjectDetails?.id === projectId
                ? undefined
                : state.currentProjectDetails,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete project";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: "project-storage",
    }
  )
);

export const useProject = () => useProjectStore();