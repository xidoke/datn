import { StateCreator } from "zustand";
import { MemberStore } from "../memberStore";
import { apiClient } from "@/lib/api/api-client";
import { MemberResponse } from "@/types";

export enum EWorkspaceRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}
export interface UserLite {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  role: string;
  workspaceSlug: string;
  joinedAt: Date;
  user: UserLite;
}

export type WorkspaceRole = EWorkspaceRole.ADMIN | EWorkspaceRole.MEMBER;

export interface IWorkspaceMemberInvitation {
  accepted: boolean;
  email: string;
  id: string;
  message: string;
  responded_at: Date;
  role: WorkspaceRole;
  token: string;
  workspace: {
    id: string;
    logo: string;
    name: string;
    slug: string;
  };
}

interface WorkspaceMemberSliceState {
  workspaceMemberMap: Record<string, Record<string, WorkspaceMember>>;
  workspaceMemberInvitations: Record<string, IWorkspaceMemberInvitation[]>;
  workspaceMemberIds: string[];
  workspaceMemberInvitationIds: string[] | undefined;
}

const initialState: WorkspaceMemberSliceState = {
  workspaceMemberMap: {},
  workspaceMemberInvitations: {},
  workspaceMemberIds: [],
  workspaceMemberInvitationIds: undefined,
};

interface WorkspaceMemberSliceActions {
  fetchWorkspaceMembers: (workspaceSlug: string) => Promise<MemberResponse>;
  inviteMember: (workspaceSlug: string, email: string, role: string) => Promise<void>;
  // getWorkspaceMemberDetails: (workspaceMemberId: string) => WorkspaceMember | undefined;
  // getWorkspaceMemberInvitations: (workspaceId: string) => void;
  // addWorkspaceMember: (workspaceId: string, member: WorkspaceMembership) => void;
  // removeWorkspaceMember: (workspaceId: string, memberId: string) => void;
  // updateWorkspaceMember: (workspaceId: string, memberId: string, role: TUserPermissions) => void;
  // addWorkspaceMemberInvitation: (workspaceId: string, invitation: IWorkspaceMemberInvitation) => void;
  // removeWorkspaceMemberInvitation: (workspaceId: string, invitationId: string) => void;
  resetWorkspaceMember: () => void;
}

export type WorkspaceMemberSlice = WorkspaceMemberSliceState &
  WorkspaceMemberSliceActions;

export const workspaceMemberSlice: StateCreator<
  MemberStore,
  [],
  [],
  WorkspaceMemberSlice
// eslint-disable-next-line @typescript-eslint/no-unused-vars
> = (set, get) => ({
  ...initialState,
  fetchWorkspaceMembers: async (workspaceSlug: string) => {
    try {
      const response: MemberResponse = await apiClient.get(
        `/workspaces/${workspaceSlug}/members`,
      );

      const { members: workspaceMembers } = response;
      set((state) => {
        const newWorkspaceMemberMap = { ...state.workspaceMemberMap };
        const memberMap: Record<string, WorkspaceMember> = {};

        workspaceMembers.forEach((member) => {
          memberMap[member.id] = member;
        });

        newWorkspaceMemberMap[workspaceSlug] = memberMap;

        return {
          workspaceMemberMap: newWorkspaceMemberMap,
          workspaceMemberIds: workspaceMembers.map((member) => member.id),
        };
      });

      return response;
    } catch (error) {
      console.error("Error fetching workspace members:", error);
      throw error;
    }
  },
  inviteMember: async (workspaceSlug: string, email: string, role: string) => {
    try {
      await apiClient.post(`/workspaces/${workspaceSlug}/invitations`, {
        email,
        role,
      });
    } catch (error) {
      console.error("Error inviting member:", error);
      throw error;
    }
  },
  // TODO implement getWorkspaceMemberDetails
  resetWorkspaceMember: () => {
    set(initialState);
  },
  

});
