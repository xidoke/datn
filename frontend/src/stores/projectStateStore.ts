import { State } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ProjectStateStore {
  states: State[];
  isLoading: boolean;
  fetchStates: (projectId: string) => Promise<void>;
  addState: (state: Omit<State, "id">) => Promise<void>;
  updateState: (id: string, updates: Partial<State>) => Promise<void>;
  deleteState: (id: string) => Promise<void>;
}

const sampleStates: State[] = [
  {
    id: "1",
    name: "Backlog",
    color: "#9333ea",
    group: "backlog",
    description: "Initial state for new issues",
    isDefault: true,
  },
  {
    id: "2",
    name: "Todo",
    color: "#3b82f6",
    group: "unstarted",
    description: "Issues to be worked on",
  },
  {
    id: "3",
    name: "In Progress",
    color: "#eab308",
    group: "started",
    description: "Issues currently being worked on",
  },
  {
    id: "4",
    name: "Done",
    color: "#22c55e",
    group: "completed",
    description: "Completed issues",
  },
  {
    id: "5",
    name: "Cancelled",
    color: "#ef4444",
    group: "cancelled",
    description: "Cancelled or abandoned issues",
  },
];

export const useProjectStateStore = create<ProjectStateStore>()(
  devtools(
    persist(
      (set, get) => ({
        states: [],
        isLoading: false,

        fetchStates: async (projectId: string) => {
          set({ isLoading: true });
          try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const currentStates = get().states;
            if (currentStates.length === 0) {
              set({ states: sampleStates });
            }
          } catch (error) {
            throw new Error("Failed to fetch states");
          } finally {
            set({ isLoading: false });
          }
        },

        addState: async (state: Omit<State, "id">) => {
          const newState = { ...state, id: Date.now().toString() };
          set((store) => ({ states: [...store.states, newState] }));

          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // If API call succeeds, the optimistic update remains
          } catch (error) {
            // If API call fails, revert the optimistic update
            set((store) => ({
              states: store.states.filter((s) => s.id !== newState.id),
            }));
            throw error;
          }
        },

        updateState: async (id: string, updates: Partial<State>) => {
          const previousStates = get().states;
          set((store) => ({
            states: store.states.map((state) =>
              state.id === id ? { ...state, ...updates } : state,
            ),
          }));

          // If setting a new default state, update other states
          if (updates.isDefault) {
            set((store) => ({
              states: store.states.map((state) =>
                state.id !== id ? { ...state, isDefault: false } : state,
              ),
            }));
          }

          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // If API call succeeds, the optimistic update remains
          } catch (error) {
            // If API call fails, revert the optimistic update
            set({ states: previousStates });
            throw error;
          }
        },

        deleteState: async (id: string) => {
          const previousStates = get().states;
          set((store) => ({
            states: store.states.filter((state) => state.id !== id),
          }));

          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // If API call succeeds, the optimistic update remains
          } catch (error) {
            // If API call fails, revert the optimistic update
            set({ states: previousStates });
            throw error;
          }
        },
      }),
      {
        name: "project-state-storage",
      },
    ),
  ),
);
