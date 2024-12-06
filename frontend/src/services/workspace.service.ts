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

}
