/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api/api-client";
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
  // getWorkspaceById: (workspaceId: string) => Workspace | undefined;
  // fetch actions
  getPermissions: (workspaceSlug: string) => any;
  fetchWorkspaces: () => Promise<Workspace[]>;
  // // crud actions
  createWorkspace: (data: Partial<Workspace>) => Promise<Workspace>;
  // updateWorkspace: (
  //   workspaceSlug: string,
  //   data: Partial<Workspace>,
  // ) => Promise<Workspace>;
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
          const res : any= await apiClient.post("workspaces", data);
          const workspace = res.data
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
          const res : any= await apiClient.patch(
            `workspaces/${workspaceSlug}`,
            data,
          );
          const updatedWorkspace = res.data;
          set({
            workspaces: get().workspaces?.map((w) =>
              w.slug === workspaceSlug ? updatedWorkspace : w,
            ),
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

          const res : any= await apiClient.patch(
            `workspaces/${slug}/logo`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          const updatedWorkspace = res.data;

          set((state) => ({
            workspaces: state.workspaces?.map((w) =>
              w.slug === slug ? updatedWorkspace : w,
            ),
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
            workspaces: get().workspaces?.filter(
              (workspace) => workspace.slug !== workspaceSlug,
            ),
          });
        } catch (error) {
          throw error;
        }
      },
      reset() {
        set(initialState);
      },
    }),
    {
      name: "workspace-storage",
    },
  ),
);

export const useWorkspace = () => useWorkspaceStore((state) => state);
