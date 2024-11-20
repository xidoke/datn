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
  avatarUrl: string | null;
}

export interface WorkspaceMember {
  id: string;
  role: string; // Changed from TUserPermissions to string
  userId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
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
export interface WorkspaceMembership {
  id: string;
  userId: string; // Changed from 'member' to 'userId'
  role: string; // Changed from EUserPermissions to string
}

interface WorkspaceMemberSliceState {
  workspaceMemberMap: Record<string, Record<string, WorkspaceMembership>>;
  workspaceMemberInvitations: Record<string, IWorkspaceMemberInvitation[]>;
  workspaceMemberIds: string[] | undefined;
  workspaceMemberInvitationIds: string[] | undefined;
}

const initialState: WorkspaceMemberSliceState = {
  workspaceMemberMap: {},
  workspaceMemberInvitations: {},
  workspaceMemberIds: undefined,
  workspaceMemberInvitationIds: undefined,
};

interface WorkspaceMemberSliceActions {
  fetchWorkspaceMembers: (workspaceSlug: string) => Promise<WorkspaceMember[]>;
  getWorkspaceMemberDetails: (workspaceMemberId: string) => WorkspaceMember | undefined;
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
      const workspaceMembers: WorkspaceMember[] = await apiClient.get(
        `/workspaces/${workspaceSlug}/members`,
      );

      set((state) => {
        const newWorkspaceMemberMap = { ...state.workspaceMemberMap };
        const memberMap: Record<string, WorkspaceMembership> = {};

        workspaceMembers.forEach((member) => {
          memberMap[member.id] = {
            id: member.id,
            userId: member.userId,
            role: member.role,
          };
        });

        newWorkspaceMemberMap[workspaceSlug] = memberMap;

        return {
          workspaceMemberMap: newWorkspaceMemberMap,
          workspaceMemberIds: workspaceMembers.map((member) => member.id),
        };
      });

      return workspaceMembers;
    } catch (error) {
      console.error("Error fetching workspace members:", error);
      throw error;
    }
  },
  // TODO implement getWorkspaceMemberDetails
  

});
