import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Workspace, Project } from "@/types";

interface AppState {
  user: User | null;
  currentWorkspace: Workspace | null;
  currentProject: Project | null;
  setUser: (user: User | null) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setCurrentProject: (project: Project | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      currentWorkspace: null,
      currentProject: null,
      setUser: (user) => set({ user }),
      setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      setCurrentProject: (project) => set({ currentProject: project }),
      logout: () =>
        set({ user: null, currentWorkspace: null, currentProject: null }),
    }),
    {
      name: "app-storage",
    },
  ),
);
