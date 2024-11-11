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
  fetchWorkspaces: () => Promise<Workspace[]>;
  // // crud actions
  createWorkspace: (data: Partial<Workspace>) => Promise<Workspace>;
  // updateWorkspace: (
  //   workspaceSlug: string,
  //   data: Partial<Workspace>,
  // ) => Promise<Workspace>;
  // updateWorkspaceLogo: (workspaceSlug: string, logoURL: string) => void;
  // deleteWorkspace: (workspaceSlug: string) => Promise<void>;
  setCurrentWorkspace: (workspaceSlug: string) => void;
  updateWorkspace: (workspaceSlug: string, data: Partial<Workspace>) => Promise<Workspace>;

}

type WorkspaceStore =  WorkspaceState & WorkspaceActions

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
          const workspaces: Workspace[] =
            await apiClient.get("workspaces");
          set({ workspaces : workspaces });
          return workspaces;
        } catch (error) {
          throw error;
        } finally {
          set({ loader: false });
        }
        return [];
      },
      createWorkspace: async (data: Partial<Workspace>) => {
        try {
          const workspace: Workspace = await apiClient.post("workspaces", data);
          set({ workspaces: [...get().workspaces, workspace], currentWorkspace: workspace });
          useUserStore.getState().lastWorkspaceSlug = workspace.slug;
          return workspace;
        }
        catch (error) {
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
    updateWorkspace: async (workspaceSlug: string, data: Partial<Workspace>) => {
      const workspace = get().workspaces.find(
        (workspace) => workspace.slug === workspaceSlug,
      );
      if (!workspace) {
        // TODO: Handle error
        throw new Error("Workspace not found");
      }
      try {
        const updatedWorkspace : Workspace = await apiClient.patch(`workspaces/${workspaceSlug}`, data);
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
    }),
    {
      name: "workspace-storage",
    },
  ),
);

export const useWorkspace = () => useWorkspaceStore((state) => state);
