import { StateCreator } from "zustand";
import { MemberStore } from "../memberStore";
import { apiClient } from "@/lib/api/api-client";

export enum EUserPermissions {
  ADMIN = 20,
  MEMBER = 15,
}
export interface UserLite {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl: string | undefined;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  role: string;
  workspaceSlug: string;
  joinedAt: Date;
  user: UserLite;
}

export type TUserPermissions = EUserPermissions.ADMIN | EUserPermissions.MEMBER;

export interface IWorkspaceMemberInvitation {
  accepted: boolean;
  email: string;
  id: string;
  message: string;
  responded_at: Date;
  role: TUserPermissions;
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

export interface MemberResponse {
  members: WorkspaceMember[];
  totalCount: number;
  page: number;
  pageSize: number;
}

interface WorkspaceMemberSliceActions {
  fetchWorkspaceMembers: (workspaceSlug: string) => Promise<MemberResponse>;
  // getWorkspaceMemberDetails: (workspaceMemberId: string) => WorkspaceMember | undefined;
  // getWorkspaceMemberInvitations: (workspaceId: string) => void;
  // addWorkspaceMember: (workspaceId: string, member: WorkspaceMembership) => void;
  // removeWorkspaceMember: (workspaceId: string, memberId: string) => void;
  // updateWorkspaceMember: (workspaceId: string, memberId: string, role: TUserPermissions) => void;
  // addWorkspaceMemberInvitation: (workspaceId: string, invitation: IWorkspaceMemberInvitation) => void;
  // removeWorkspaceMemberInvitation: (workspaceId: string, invitationId: string) => void;
}

export type WorkspaceMemberSlice = WorkspaceMemberSliceState &
  WorkspaceMemberSliceActions;

export const workspaceMemberSlice: StateCreator<
  MemberStore,
  [],
  [],
  WorkspaceMemberSlice
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
  // TODO implement getWorkspaceMemberDetails
  

});
