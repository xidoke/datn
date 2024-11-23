import { Label } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ProjectLabelStore {
  labels: Label[];
  isLoading: boolean;
  fetchLabels: (projectId: string) => Promise<void>;
  addLabel: (label: Omit<Label, "id">) => Promise<void>;
  updateLabel: (id: string, updates: Partial<Label>) => Promise<void>;
  deleteLabel: (id: string) => Promise<void>;
}

const sampleLabels: Label[] = [
  { id: "1", name: "Bug", color: "#e5484d" },
  { id: "2", name: "Feature", color: "#4bce97" },
  { id: "3", name: "Enhancement", color: "#62b0fd" },
];

export const useProjectLabelStore = create<ProjectLabelStore>()(
  devtools(
    persist(
      (set, get) => ({
        labels: [],
        isLoading: false,

        fetchLabels: async (projectId: string) => {
          set({ isLoading: true });
          try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const currentLabels = get().labels;
            if (currentLabels.length === 0) {
              set({ labels: sampleLabels });
            }
          } catch (error) {
            throw new Error("Failed to fetch labels");
          } finally {
            set({ isLoading: false });
          }
        },

        addLabel: async (label: Omit<Label, "id">) => {
          const newLabel = { ...label, id: Date.now().toString() };
          set((state) => ({ labels: [...state.labels, newLabel] }));

          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // throw new Error("Failed to add label");
            // If API call succeeds, the optimistic update remains
          } catch (error) {
            // If API call fails, revert the optimistic update
            set((state) => ({
              labels: state.labels.filter((l) => l.id !== newLabel.id),
            }));
            throw error;
          }
        },

        updateLabel: async (id: string, updates: Partial<Label>) => {
          const previousLabels = get().labels;
          set((state) => ({
            labels: state.labels.map((label) =>
              label.id === id ? { ...label, ...updates } : label,
            ),
          }));

          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // If API call succeeds, the optimistic update remains
          } catch (error) {
            // If API call fails, revert the optimistic update
            set({ labels: previousLabels });
            throw error;
          }
        },

        deleteLabel: async (id: string) => {
          const previousLabels = get().labels;
          set((state) => ({
            labels: state.labels.filter((label) => label.id !== id),
          }));

          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            throw new Error("Failed to delete label");
            // If API call succeeds, the optimistic update remains
          } catch (error) {
            // If API call fails, revert the optimistic update
            set({ labels: previousLabels });
            throw error;
          }
        },
      }),
      {
        name: "project-label-storage",
      },
    ),
  ),
);
