import { apiClient } from "@/lib/api/api-client";
import { Workspace } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./userStore";

interface WorkspaceState {
  loader: boolean;
  workspaces: Workspace[];
  currentWorkspace: Workspace | undefined;
  workspacesCreatedByCurrentUser: Workspace[] | undefined;
}

interface WorkspaceActions {
  getWorkspaceBySlug: (workspaceSlug: string) => Workspace | undefined;
  // getWorkspaceById: (workspaceId: string) => Workspace | undefined;
  // fetch actions
  fetchWorkspaces: () => void;
  // // crud actions
  createWorkspace: (data: Partial<Workspace>) => Promise<Workspace>;
  // updateWorkspace: (
  //   workspaceSlug: string,
  //   data: Partial<Workspace>,
  // ) => Promise<Workspace>;
  updateWorkspaceLogo: (workspaceSlug: string, logoFile: File) => void;
  deleteWorkspace: (workspaceSlug: string) => Promise<void>;
  setCurrentWorkspace: (workspaceSlug: string) => void;
  updateWorkspace: (
    workspaceSlug: string,
    data: Partial<Workspace>,
  ) => Promise<Workspace>;
}

type WorkspaceStore = WorkspaceState & WorkspaceActions;

const initialState: WorkspaceState = {
  loader: false,
  workspaces: [],
  currentWorkspace: undefined,
  workspacesCreatedByCurrentUser: undefined,
};

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      getWorkspaceBySlug: (workspaceSlug: string) => {
        return get().workspaces.find(
          (workspace) => workspace.slug === workspaceSlug,
        );
      },
      fetchWorkspaces: async () => {
        set({ loader: true });
        try {
          const response : { workspaces: Workspace[]} = await apiClient.get("workspaces");
          set({ workspaces: response.workspaces });
          return;
        } catch (error) {
          throw error;
        } finally {
          set({ loader: false });
        }
      },
      createWorkspace: async (data: Partial<Workspace>) => {
        try {
          const workspace: Workspace = await apiClient.post("workspaces", data);
          set({
            workspaces: [...get().workspaces, workspace],
            currentWorkspace: workspace,
          });
          useUserStore.getState().lastWorkspaceSlug = workspace.slug;
          return workspace;
        } catch (error) {
          // TODO: Handle error
          throw error;
        }
      },
      setCurrentWorkspace: (workspaceSlug: string) => {
        const workspace = get().workspaces.find(
          (workspace) => workspace.slug === workspaceSlug,
        );
        if (workspace) {
          set({ currentWorkspace: workspace });
          useUserStore.getState().updateLastWorkspaceSlug(workspaceSlug);
        }
      },
      updateWorkspace: async (
        workspaceSlug: string,
        data: Partial<Workspace>,
      ) => {
        const workspace = get().workspaces.find(
          (workspace) => workspace.slug === workspaceSlug,
        );
        if (!workspace) {
          // TODO: Handle error
          throw new Error("Workspace not found");
        }
        try {
          const updatedWorkspace: Workspace = await apiClient.patch(
            `workspaces/${workspaceSlug}`,
            data,
          );
          set({
            workspaces: get().workspaces.map((w) =>
              w.slug === workspaceSlug ? updatedWorkspace : w,
            ),
            currentWorkspace: updatedWorkspace,
          });
          return updatedWorkspace;
        } catch (error) {
          throw error;
        }
      },
      updateWorkspaceLogo: async (slug: string, logoFile: File) => {
        try {
          const formData = new FormData();
          formData.append("logo", logoFile);

          const updatedWorkspace: Workspace = await apiClient.patch(
            `workspaces/${slug}/logo`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          set((state) => ({
            workspaces: state.workspaces.map((w) =>
              w.slug === slug ? updatedWorkspace : w,
            ),
            currentWorkspace:
              state.currentWorkspace?.slug === slug
                ? updatedWorkspace
                : state.currentWorkspace,
          }));

          return updatedWorkspace;
        } catch (error) {
          throw error;
        }
      },
      deleteWorkspace: async (workspaceSlug: string) => {
        try {
          await apiClient.delete(`workspaces/${workspaceSlug}`);
          set({
            workspaces: get().workspaces.filter(
              (workspace) => workspace.slug !== workspaceSlug,
            ),
          });
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: "workspace-storage",
    },
  ),
);

export const useWorkspace = () => useWorkspaceStore((state) => state);
