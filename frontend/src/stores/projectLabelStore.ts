import { Label } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { LabelService } from "@/services/label.service";

interface ProjectLabelStore {
  labels: Label[];
  isLoading: boolean;
  fetchLabels: (workspaceSlug: string, projectId: string) => Promise<void>;
  addLabel: (workspaceSlug: string, projectId: string, label: Omit<Label, "id">) => Promise<void>;
  updateLabel: (workspaceSlug: string, projectId: string, id: string, updates: Partial<Label>) => Promise<void>;
  deleteLabel: (workspaceSlug: string, projectId: string, id: string) => Promise<void>;
}

const labelService = new LabelService();

export const useProjectLabelStore = create<ProjectLabelStore>()(
  devtools(
    persist(
      (set, get) => ({
        labels: [],
        isLoading: false,

        fetchLabels: async (workspaceSlug: string, projectId: string) => {
          set({ isLoading: true });
          try {
            const labels = await labelService.fetchLabels(workspaceSlug, projectId);
            set({ labels });
          } catch (error) {
            console.error("Failed to fetch labels:", error);
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        addLabel: async (workspaceSlug: string, projectId: string, label: Omit<Label, "id">) => {
          try {
            const newLabel = await labelService.addLabel(workspaceSlug, projectId, label);
            set((state) => ({ labels: [...state.labels, newLabel] }));
          } catch (error) {
            console.error("Failed to add label:", error);
            throw error;
          }
        },

        updateLabel: async (workspaceSlug: string, projectId: string, id: string, updates: Partial<Label>) => {
          const previousLabels = get().labels;
          set((state) => ({
            labels: state.labels.map((label) =>
              label.id === id ? { ...label, ...updates } : label
            ),
          }));

          try {
            await labelService.updateLabel(workspaceSlug, projectId, id, updates);
          } catch (error) {
            console.error("Failed to update label:", error);
            set({ labels: previousLabels });
            throw error;
          }
        },

        deleteLabel: async (workspaceSlug: string, projectId: string, id: string) => {
          const previousLabels = get().labels;
          set((state) => ({
            labels: state.labels.filter((label) => label.id !== id),
          }));

          try {
            await labelService.deleteLabel(workspaceSlug, projectId, id);
          } catch (error) {
            console.error("Failed to delete label:", error);
            set({ labels: previousLabels });
            throw error;
          }
        },
      }),
      {
        name: "project-label-storage",
      }
    )
  )
);