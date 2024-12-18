// src/services/member.service.ts

import { WorkspaceMember, MemberResponse, InvitationsWorkspaceResponse, Invitation } from "@/types";
import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";

export class MemberService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async fetchWorkspaceMembers(workspaceSlug: string): Promise<MemberResponse> {
    try {
      const response = await this.get<MemberResponse>(`/workspaces/${workspaceSlug}/members`);
      return response.data.data as MemberResponse;
    } catch (error) {
      throw error;
    }
  }

  async inviteMember(workspaceSlug: string, email: string, role: string): Promise<WorkspaceMember> {
    return this.post<WorkspaceMember>(`/workspaces/${workspaceSlug}/invitations`, { email, role }).then((response) => response.data.data).catch((error) => {
      throw error.response.data;
    })
  }

  async fetchWorkspaceMemberInvitations(workspaceSlug: string): Promise<InvitationsWorkspaceResponse> {
    return this.get<InvitationsWorkspaceResponse>(`/workspaces/${workspaceSlug}/invitations?status=PENDING`).then((response) => response.data.data).catch((error) => {
      throw error.response.data;
    })
  }

  async updateMemberRole(workspaceSlug: string, memberId: string, role: string): Promise<WorkspaceMember> {
    try {
      const response = await this.patch<WorkspaceMember>(`/workspaces/${workspaceSlug}/members/${memberId}`, { role });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async removeMember(workspaceSlug: string, memberId: string) {
    try {
      const response = await this.delete<void>(`/workspaces/${workspaceSlug}/members/${memberId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteInvitation(workspaceSlug: string, invitationId: string) {
    try {
      const response = await this.delete<void>(`/workspaces/${workspaceSlug}/invitations/${invitationId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async updateInvitationRole(workspaceSlug: string, invitationId: string, role: string) {
    try {
      const response = await this.patch<Invitation>(`/workspaces/${workspaceSlug}/invitations/${invitationId}`, { role });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}