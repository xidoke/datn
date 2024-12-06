import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { ApiResponse } from "@/types";

export interface Comment {
  id: string;
  content: string;
  userId: string;
  issueId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
}

export class CommentService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async getCommentsByIssue(workspaceSlug: string, projectId: string, issueId: string): Promise<ApiResponse<Comment[]>> {
    return this.get<Comment[]>(`/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/comments/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createComment(workspaceSlug: string, projectId: string, issueId: string, content: string): Promise<ApiResponse<Comment>> {
    return this.post<Comment>(`/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/comments`, { content })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteComment(workspaceSlug: string, projectId: string, issueId: string,commentId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/comments/${commentId}`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateComment(workspaceSlug: string, projectId: string, issueId: string,commentId: string, content: string): Promise<ApiResponse<Comment>> {
    return this.patch<Comment>(`/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/comments/${commentId}`, { content })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}