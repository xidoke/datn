import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  Issue,
  IssueFilters,
  IssueView,
  GroupBy,
  OrderBy,
} from "@/types/issue";
import { apiClient } from "@/lib/api/api-client";

interface IssueState {
  issues: Record<string, Issue>;
  filters: IssueFilters;
  view: IssueView;
  groupBy: GroupBy;
  orderBy: OrderBy;
  isLoading: boolean;
  error: string | null;
}

interface IssueActions {
  fetchIssues: (slug: string, projectId: string) => Promise<void>;
  addIssue: (
    slug: string,
    projectId: string,
    issue: Omit<Issue, "id">,
  ) => Promise<void>;
  updateIssue: (issueId: string, updates: Partial<Issue>) => Promise<void>;
  deleteIssue: (issueId: string) => Promise<void>;
  setFilters: (filters: IssueFilters) => void;
  setView: (view: IssueView) => void;
  setGroupBy: (groupBy: GroupBy) => void;
  setOrderBy: (orderBy: OrderBy) => void;
  reorderIssue: (issueId: string, newOrder: number) => Promise<void>;
  moveIssue: (issueId: string, newStateId: string) => Promise<void>;
}

export const useIssueStore = create<IssueState & IssueActions>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        issues: {},
        filters: {},
        view: "kanban",
        groupBy: "state",
        orderBy: "manual",
        isLoading: false,
        error: null,

        // Actions
        fetchIssues: async (slug: string, projectId: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.get<Issue[]>(
              `workspaces/${slug}/projects/${projectId}/issues`,
            );
            const issues = response;
            const issuesMap = issues.reduce(
              (acc: Record<string, Issue>, issue: Issue) => {
                acc[issue.id] = issue;
                return acc;
              },
              {},
            );
            set({ issues: issuesMap, isLoading: false });
          } catch (error) {
            console.error(error);
            set({ error: "Failed to fetch issues", isLoading: false });
          }
        },

        addIssue: async (slug: string, projectId: string, issue: Omit<Issue, "id">) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.post<Issue>(`workspaces/${slug}/projects/${projectId}/issues`, issue);
            const newIssue = response;
            set((state) => ({
              issues: { ...state.issues, [newIssue.id]: newIssue },
              isLoading: false,
            }));
          } catch (error) {
            set({ error: "Failed to add issue", isLoading: false });
          }
        },

        updateIssue: async (issueId: string, updates: Partial<Issue>) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.patch(
              `/issues/${issueId}`,
              updates,
            );
            const updatedIssue = response.data;
            set((state) => ({
              issues: { ...state.issues, [issueId]: updatedIssue },
              isLoading: false,
            }));
          } catch (error) {
            set({ error: "Failed to update issue", isLoading: false });
          }
        },

        deleteIssue: async (issueId: string) => {
          set({ isLoading: true, error: null });
          try {
            await apiClient.delete(`/issues/${issueId}`);
            set((state) => {
              const { [issueId]: _, ...rest } = state.issues;
              return { issues: rest, isLoading: false };
            });
          } catch (error) {
            set({ error: "Failed to delete issue", isLoading: false });
          }
        },

        setFilters: (filters) => {
          set({ filters });
        },

        setView: (view) => {
          set({ view });
        },

        setGroupBy: (groupBy) => {
          set({ groupBy });
        },

        setOrderBy: (orderBy) => {
          set({ orderBy });
        },

        reorderIssue: async (issueId: string, newOrder: number) => {
          set({ isLoading: true, error: null });
          try {
            await apiClient.post(`/issues/${issueId}/reorder`, {
              newOrder,
            });
            set((state) => ({
              issues: {
                ...state.issues,
                [issueId]: { ...state.issues[issueId], order: newOrder },
              },
              isLoading: false,
            }));
          } catch (error) {
            set({ error: "Failed to reorder issue", isLoading: false });
          }
        },

        moveIssue: async (issueId: string, newStateId: string) => {
          set({ isLoading: true, error: null });
          try {
            await apiClient.post(`/issues/${issueId}/move`, {
              newStateId,
            });
            set((state) => ({
              issues: {
                ...state.issues,
                [issueId]: { ...state.issues[issueId], stateId: newStateId },
              },
              isLoading: false,
            }));
          } catch (error) {
            set({ error: "Failed to move issue", isLoading: false });
          }
        },
      }),
      {
        name: "issue-storage",
        partialize: (state) => ({
          view: state.view,
          groupBy: state.groupBy,
          orderBy: state.orderBy,
          filters: state.filters,
        }),
      },
    ),
  ),
);
