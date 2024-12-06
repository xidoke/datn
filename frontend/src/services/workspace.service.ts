import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { ApiResponse, InvitationsResponse, Workspace } from "@/types";

export class WorkspaceService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async fetchUserWorkspaces() : Promise<ApiResponse<{workspaces: Workspace[], totalCount: number}>> {
    return this.get<{workspaces: Workspace[], totalCount: number}>("/workspaces")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async userWorkspaceInvitations(): Promise<InvitationsResponse> {
    return this.get<InvitationsResponse>("/users/me/invitations?status=PENDING")
      .then((response) => response?.data.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async acceptWorkspaceInvitation(invitationId: string) {
    return this.post(`/users/me/invitations/${invitationId}/accept/`)
      .then((response) => response?.data.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async rejectWorkspaceInvitation(invitationId: string) {
    return this.post(`/users/me/invitations/${invitationId}/reject/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getWorkspaceDashboard(workspaceSlug: string) {
    return this.get(`/workspaces/${workspaceSlug}/dashboard`)
      .then((response) => response?.data.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createWorkspace(data: Partial<Workspace>): Promise<Workspace> {
    return this.post<Workspace>("/workspaces", data)
      .then((response) => response?.data.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteWorkspace(workspaceSlug: string) {
    return this.delete<void>(`/workspaces/${workspaceSlug}`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateWorkspace(workspaceSlug: string, data: Partial<Workspace>) {
    return this.patch<Workspace>(`/workspaces/${workspaceSlug}`, data)
      .then((response) => response?.data.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  // update logo
  async updateWorkspaceLogo(workspaceSlug: string, logoFile: File): Promise<Workspace> {
    const formData = new FormData();
    formData.append("logo", logoFile);

    return this.post<Workspace>(`/workspaces/${workspaceSlug}/logo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => response?.data.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

}
