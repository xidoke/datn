import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Issue } from '@/types';
import { apiClient } from '@/lib/api/api-client';
import { IssueService } from '@/services/issue.service';

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

interface IssueFilters {
  state?: string;
  assignee?: string;
  label?: string;
  priority?: number;
  dueDate?: string;
  assigneeIds?: string[];
  startDate?: Date;
}

export interface IssueUpdateDto {
  title?: string;
  description?: string;
  stateId?: string;
  assigneeIds?: string[];
  labelIds?: string[];
  priority?: number;
  dueDate?: string;
  startDate?: string;
  cycleId?: string;
}
interface IssueStore {
  issues: Issue[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: IssueFilters;
  groupBy: string | null;
  subGroupBy: string | null;

  fetchIssues: (workspaceSlug: string, projectId: string, page?: number, pageSize?: number) => Promise<void>;
  getIssueById: (issueId: string) => Issue | undefined;
  createIssue: (workspaceSlug: string, projectId: string, issueData: Partial<Issue>) => Promise<Issue>;
  updateIssue: (workspaceSlug: string, projectId: string, issueId: string, issueData : Partial<IssueUpdateDto>) => Promise<Issue>;
  deleteIssue: (workspaceSlug: string, projectId: string, issueId: string) => Promise<void>;
  setFilters: (filters: IssueFilters) => void;
  setGrouping: (groupBy: string | null, subGroupBy: string | null) => void;
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
  filters: {
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
          const issues : { issues: Issue[], pagination: any} = await issueService.fetchIssues(workspaceSlug, projectId, {
              page,
              pageSize,
              ...get().filters,
              group_by: get().groupBy,
              sub_group_by: get().subGroupBy,

          });
          set({
            issues: issues.issues,
            pagination: issues.pagination,
            isLoading: false,
          });
        } catch (error) {
          set({ error: 'Failed to fetch issues', isLoading: false });
        }
      },

      getIssueById: (issueId) => {
        return get().issues.find(issue => issue.id === issueId);
      },

      createIssue: async (workspaceSlug, projectId, issueData) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: fix this
          const response : any = await apiClient.post(`/workspaces/${workspaceSlug}/projects/${projectId}/issues`, issueData);
          const newIssue = response.data;
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
          const response : any= await apiClient.patch(`/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}`, issueData);
          const updatedIssue = response.data;
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
          await apiClient.delete(`/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}`);
          set(state => ({
            issues: state.issues.filter(issue => issue.id !== issueId),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to delete issue', isLoading: false });
          throw error;
        }
      },

      setFilters: (filters) => {
        set({ filters });
      },

      setGrouping: (groupBy, subGroupBy) => {
        set({ groupBy, subGroupBy });
      },
    }),
    { name: 'issue-store' } 
  ))
);

export default useIssueStore;