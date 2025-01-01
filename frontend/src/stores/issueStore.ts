import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Issue } from '@/types';
import { IssueService } from '@/services/issue.service';

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface IssueUpdateDto {
  title?: string;
  description?: string;
  stateId?: string;
  assigneeIds?: string[];
  labelIds?: string[];
  priority?: number;
  dueDate?: string | null;
  startDate?: string | null;
  cycleId?: string | null;
}
interface IssueStore {
  issues: Issue[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo;

  fetchIssues: (workspaceSlug: string, projectId: string, page?: number, pageSize?: number) => Promise<void>;
  getIssueById: (issueId: string) => Issue | undefined;
  createIssue: (workspaceSlug: string, projectId: string, issueData: Partial<Issue>) => Promise<Issue>;
  updateIssue: (workspaceSlug: string, projectId: string, issueId: string, issueData : Partial<IssueUpdateDto>) => Promise<Issue>;
  deleteIssue: (workspaceSlug: string, projectId: string, issueId: string) => Promise<void>;
  reset: () => void;
}

const initialState  = {
   issues: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
  },
  groupBy: null,
  subGroupBy: null,
};

const issueService = new IssueService();

const useIssueStore = create<IssueStore>()(
  devtools(
    persist(
    (set, get) => ({
      ...initialState,

      reset: () => set(initialState),
      fetchIssues: async (workspaceSlug, projectId, page = 1, pageSize = 100) => {
        set({ isLoading: true, error: null });
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const issues : { issues: Issue[], pagination: any} = await issueService.fetchIssues(workspaceSlug, projectId, {
              page,
              pageSize,
          });
          set({
            issues: issues.issues,
            pagination: issues.pagination,
            isLoading: false,
          });
        } catch (error) {
          set({ error: 'Failed to fetch issues', isLoading: false });
          throw error;
        }
      },

      getIssueById: (issueId) => {
        return get().issues.find(issue => issue.id === issueId);
      },

      createIssue: async (workspaceSlug, projectId, issueData) => {
        set({ isLoading: true, error: null });
        try {
          const newIssue = await issueService.createIssue(workspaceSlug, projectId, issueData);
          set(state => ({ issues: [...state.issues, newIssue], isLoading: false }));
          return newIssue;
        } catch (error) {
          set({ error: 'Failed to create issue', isLoading: false });
          throw error;
        }
      },

      updateIssue: async (workspaceSlug, projectId, issueId, issueData) => {
        set({ isLoading: true, error: null });
        try {
          const updatedIssue = await issueService.updateIssue(workspaceSlug, projectId, issueId, issueData);
          set(state => ({
            issues: state.issues.map(issue => issue.id === issueId ? updatedIssue : issue),
            isLoading: false
          }));
          return updatedIssue;
        } catch (error) {
          set({ error: 'Failed to update issue', isLoading: false });
          throw error;
        }
      },

      deleteIssue: async (workspaceSlug, projectId, issueId) => {
        set({ isLoading: true, error: null });
        try {
          await issueService.deleteIssue(workspaceSlug, projectId, issueId);
          set(state => ({
            issues: state.issues.filter(issue => issue.id !== issueId),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to delete issue', isLoading: false });
          throw error;
        }
      },
    }),
    { name: 'issue-store',
      partialize: (state) => ({
        issues: state.issues,
        pagination: state.pagination,
      }),
     } 
  ))
);

export default useIssueStore;