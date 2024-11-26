import { State } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { StateService } from "@/services/state.service";

interface ProjectStateStore {
  states: State[];
  isLoading: boolean;
  fetchStates: (workspaceSlug: string, projectId: string) => Promise<void>;
  addState: (workspaceSlug: string, projectId: string, state: Omit<State, "id">) => Promise<void>;
  updateState: (workspaceSlug: string, projectId: string, id: string, updates: Partial<State>) => Promise<void>;
  deleteState: (workspaceSlug: string, projectId: string, id: string) => Promise<void>;
  setDefaultState: (workspaceSlug: string, projectId: string, id: string) => Promise<void>;
}

const stateService = new StateService();

export const useProjectStateStore = create<ProjectStateStore>()(
  devtools(
    persist(
      (set, get) => ({
        states: [],
        isLoading: false,

        fetchStates: async (workspaceSlug: string, projectId: string) => {
          set({ isLoading: true });
          try {
            const states = await stateService.fetchStates(workspaceSlug, projectId);
            set({ states });
          } catch (error) {
            console.error("Failed to fetch states:", error);
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        addState: async (workspaceSlug: string, projectId: string, state: Omit<State, "id">) => {
          try {
            const newState = await stateService.addState(workspaceSlug, projectId, state);
            set((store) => ({ states: [...store.states, newState] }));
          } catch (error) {
            console.error("Failed to add state:", error);
            throw error;
          }
        },

        updateState: async (workspaceSlug: string, projectId: string, id: string, updates: Partial<State>) => {
          const previousStates = get().states;
          set((store) => ({
            states: store.states.map((state) =>
              state.id === id ? { ...state, ...updates } : state
            ),
          }));

          try {
            const updatedState = await stateService.updateState(workspaceSlug, projectId, id, updates);
            set((store) => ({
              states: store.states.map((state) =>
                state.id === id ? updatedState : state
              ),
            }));

            // If setting a new default state, update other states
            if (updates.isDefault) {
              set((store) => ({
                states: store.states.map((state) =>
                  state.id !== id ? { ...state, isDefault: false } : state
                ),
              }));
            }
          } catch (error) {
            console.error("Failed to update state:", error);
            set({ states: previousStates });
            throw error;
          }
        },

        deleteState: async (workspaceSlug: string, projectId: string, id: string) => {
          const previousStates = get().states;
          set((store) => ({
            states: store.states.filter((state) => state.id !== id),
          }));

          try {
            await stateService.deleteState(workspaceSlug, projectId, id);
          } catch (error) {
            console.error("Failed to delete state:", error);
            set({ states: previousStates });
            throw error;
          }
        },

        setDefaultState: async (workspaceSlug: string, projectId: string, id: string) => {
          const previousStates = get().states;
          try {
            const updatedState = await stateService.setDefaultState(workspaceSlug, projectId, id);
            set((store) => ({
              states: store.states.map((state) =>
                state.id === id ? updatedState : { ...state, isDefault: false }
              ),
            }));
          } catch (error) {
            console.error("Failed to set default state:", error);
            set({ states: previousStates });
            throw error;
          }
        },
      }),
      {
        name: "project-state-storage",
      }
    )
  )
);

