import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { InvitationsResponse } from "@/types";

export class WorkspaceService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async fetchUserWorkspaces() : Promise<any> {
    return this.get("/users/me/workspaces")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async userWorkspaceInvitations(): Promise<InvitationsResponse> {
    return this.get("/users/me/invitations?status=PENDING")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async acceptWorkspaceInvitation(invitationId: string) {
    return this.post(`/users/me/invitations/${invitationId}/accept/`)
      .then((response) => response?.data)
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


}
