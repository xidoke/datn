import { create } from "zustand";
import { IIssue, IssueState } from "@/types/issue";

export const useIssueStore = create<IssueState>((set) => ({
  issues: [],
  setIssues: (issues) => set({ issues }),
  addIssue: (issue) => set((state) => ({ issues: [...state.issues, issue] })),
  updateIssue: (updatedIssue) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === updatedIssue.id ? updatedIssue : issue,
      ),
    })),
  deleteIssue: (issueId) =>
    set((state) => ({
      issues: state.issues.filter((issue) => issue.id !== issueId),
    })),
}));
