/* eslint-disable @typescript-eslint/no-explicit-any */
import { Workspace } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./userStore";
import { WorkspaceService } from "@/services/workspace.service";

interface WorkspaceState {
  loader: boolean;
  error: string | undefined;
  totalCount: number | undefined;
  workspaces: Workspace[] | undefined;
  workspacesCreatedByCurrentUser: Workspace[] | undefined;
}

interface WorkspaceActions {
  getWorkspaceBySlug: (workspaceSlug: string) => Workspace | undefined;
  getPermissions: (workspaceSlug: string) => any;
  fetchWorkspaces: () => Promise<Workspace[]>;
  createWorkspace: (data: Partial<Workspace>) => Promise<Workspace>;
  updateWorkspaceLogo: (workspaceSlug: string, logoFile: File) => void;
  deleteWorkspace: (workspaceSlug: string) => Promise<void>;
  updateWorkspace: (
    workspaceSlug: string,
    data: Partial<Workspace>,
  ) => Promise<Workspace>;
  reset: () => void;
}

type WorkspaceStore = WorkspaceState & WorkspaceActions;

const initialState: WorkspaceState = {
  loader: false,
  totalCount: undefined,
  workspaces: undefined,
  error: undefined,

  workspacesCreatedByCurrentUser: undefined,
};

const workspaceService = new WorkspaceService();
export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      fetchWorkspaces: async () => {
        set({ loader: true, error: undefined });
        try {
          const result = await workspaceService.fetchUserWorkspaces();
          const { workspaces, totalCount } = result.data;
          set({ workspaces: workspaces, loader: false, totalCount });
          return workspaces;
        } catch (error : any) {
          set({ loader: false, error: error.message });
          console.log(error)
          throw error;
        }
      },

      getWorkspaceBySlug: (workspaceSlug: string) => {
        return get().workspaces?.find(
          (workspace) => workspace.slug === workspaceSlug,
        );
      },
      getPermissions: (workspaceSlug: string) => {
        return get().workspaces?.find(
          (workspace) => workspace.slug === workspaceSlug,
        )?.permissions;
      },
      createWorkspace: async (data: Partial<Workspace>) => {
        try {
            const workspace = await workspaceService.createWorkspace(data);
          set({
            workspaces: [...(get().workspaces || []), workspace],
          });
          useUserStore.getState().lastWorkspaceSlug = workspace.slug;
          return workspace;
        } catch (error) {
          // TODO: Handle error
          throw error;
        }
      },
      updateWorkspace: async (
        workspaceSlug: string,
        data: Partial<Workspace>,
      ) => {
        const workspace = get().workspaces?.find(
          (workspace) => workspace.slug === workspaceSlug,
        );
        if (!workspace) {
          // TODO: Handle error
          throw new Error("Workspace not found");
        }
        try {
          const updatedWorkspace = await workspaceService.updateWorkspace(workspaceSlug, data);

          set({
            workspaces: get().workspaces?.map((w) =>
              w.slug === workspaceSlug ? updatedWorkspace : w,
            ),
          });
          return updatedWorkspace;
        } catch (error) {
          console.log(error)
          throw error;
        }
      },
      updateWorkspaceLogo: async (slug: string, logoFile: File) => {
        try {
          const updatedWorkspace = await workspaceService.updateWorkspaceLogo(
            slug,
            logoFile,
          );

          set((state) => ({
            workspaces: state.workspaces?.map((w) =>
              w.slug === slug ? updatedWorkspace : w,
            ),
          }));

          return updatedWorkspace;
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
      deleteWorkspace: async (workspaceSlug: string) => {
        try {
          await workspaceService.deleteWorkspace(workspaceSlug);
          set({
            workspaces: get().workspaces?.filter(
              (workspace) => workspace.slug !== workspaceSlug,
            ),
          });
        } catch (error) {
          console.log(error)
          throw error;
        }
      },
      reset() {
        set(initialState);
      },
    }),
    {
      name: "workspace-storage",
      partialize: (state) => ({
        workspaces: state.workspaces,
        totalCount: state.totalCount,
      }),
    },
  ),
);

export const useWorkspace = () => useWorkspaceStore((state) => state);
