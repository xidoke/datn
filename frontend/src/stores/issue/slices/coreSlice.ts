import { Issue } from "@/types";
import { StateCreator } from "zustand";
import { IssueStore } from "../issueStore";

interface CoreIssueSliceState {
  issues: Issue[];
  currentIssue: Issue | undefined;
  coreIssueLoading: boolean;
  error: string | undefined;
}

interface CoreIssueSliceActions {
  getIssues(workspaceSlug: string, projectId: string): Promise<void>;
  //   setIssues: (issues: Issue[]) => void;
  //   addIssue: (issue: Issue) => void;
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
});
