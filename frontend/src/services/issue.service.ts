import { Issue } from "@/types";
import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";
export class IssueService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fetchIssues(workspaceSlug: string, projectId: string, params: any ) : Promise<{ issues: Issue[], pagination: any}> {
    return this.get<{ issues: Issue[], pagination: any}>(`workspaces/${workspaceSlug}/projects/${projectId}/issues`, params).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response?.data
  });
  }

  async fetchIssueById(workspaceSlug: string, projectId: string, issueId: string ) : Promise<Issue> {
    return this.get<Issue>(`workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}`).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response?.data
  });
  }

  async createIssue(workspaceSlug: string, projectId: string, issueData: any) {
    return this.post<Issue>(`workspaces/${workspaceSlug}/projects/${projectId}/issues`, issueData).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response?.data
    });
  }

  async updateIssue(workspaceSlug: string, projectId: string, issueId: string, issueData: any) {
    return this.patch<Issue>(`workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}`, issueData).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response?.data
    });
  }

  async deleteIssue(workspaceSlug: string, projectId: string, issueId: string) {
    return this.delete<void>(`workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}`).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response?.data
    });
  }
}
