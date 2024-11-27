// src/services/member.service.ts

import { ApiResponse, WorkspaceMember, MemberResponse } from "@/types";
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
    try {
      const response = await this.post<WorkspaceMember>(`/workspaces/${workspaceSlug}/members`, { email, role });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async updateMemberRole(workspaceSlug: string, memberId: string, role: string): Promise<ApiResponse<WorkspaceMember>> {
    try {
      const response = await this.patch<WorkspaceMember>(`/workspaces/${workspaceSlug}/members/${memberId}`, { role });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async removeMember(workspaceSlug: string, memberId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.delete<void>(`/workspaces/${workspaceSlug}/members/${memberId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}