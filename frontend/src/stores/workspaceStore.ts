import { Workspace } from "@/types";

interface WorkspaceState {
    loader: boolean;
  // observables
  workspaces: Record<string, Workspace>;
  // computed
  currentWorkspace: Workspace | null;
  workspacesCreatedByCurrentUser: Workspace[] | null;

}

interface WorkspaceActions {
    getWorkspaceBySlug: (workspaceSlug: string) => Workspace | null;
  getWorkspaceById: (workspaceId: string) => Workspace | null;
  // fetch actions
  fetchWorkspaces: () => Promise<Workspace[]>;
  // crud actions
  createWorkspace: (data: Partial<Workspace>) => Promise<Workspace>;
  updateWorkspace: (workspaceSlug: string, data: Partial<Workspace>) => Promise<Workspace>;
  updateWorkspaceLogo: (workspaceSlug: string, logoURL: string) => void;
  deleteWorkspace: (workspaceSlug: string) => Promise<void>;
}