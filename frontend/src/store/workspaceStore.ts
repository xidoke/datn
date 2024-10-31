import { IWorkspace } from "@/types/workspace";
import { create } from "zustand";

// store/workspaceStore.ts
interface WorkspaceState {
  workspaces: IWorkspace[];
  setWorkspaces: (workspaces: IWorkspace[]) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [],
  setWorkspaces: (workspaces) => set({ workspaces }),
}));
