import { Issue } from "@/types";
import { StateCreator } from "zustand";
import { IssueStore } from "../issueStore";
import { apiClient } from "@/lib/api/api-client";

interface CoreIssueSliceState {
  issues: Issue[];
  currentIssue: Issue | undefined;
  coreIssueLoading: boolean;
  error: string | undefined;
}

interface CoreIssueSliceActions {
  getIssues(workspaceSlug: string, projectId: string): Promise<void>;
  //   setIssues: (issues: Issue[]) => void;
    addIssue: (issue: Issue) => void;
    createIssue: (workspaceSlug: string, projectId: string, issue: Issue) => void;
  //   updateIssue: (updatedIssue: Issue) => void;
  //   deleteIssue: (issueId: string) => void;
}

export type CoreIssueSlice = CoreIssueSliceState & CoreIssueSliceActions;
const initialState: CoreIssueSliceState = {
  issues: [],
  currentIssue: undefined,
  coreIssueLoading: false,
  error: undefined,
};

export const coreIssueSlice: StateCreator<
  IssueStore,
  [],
  [],
  CoreIssueSlice
> = (set, get) => ({
  ...initialState,
  getIssues: async (workspaceSlug: string, projectId: string) => {
    set({ coreIssueLoading: true });
    try {
      const issues = await apiClient.get(`/workspaces/${workspaceSlug}/projects/${projectId}/issues`);
      set({ issues });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ coreIssueLoading: false });
    }
  },
  addIssue: (issue: Issue) => {
    set((state) => ({ issues: [...state.issues, issue] }));
  },
  createIssue: async (workspaceSlug: string, projectId: string, issue: Issue) => {
    try {
      const createdIssue : Issue = await apiClient.post(`/workspaces/${workspaceSlug}/projects/${projectId}/issues`, issue);
      set((state) => ({ issues: [...state.issues, createdIssue] }));
    } catch (error) {
      set({ error: error.response.data.message });
    }
  }
});
