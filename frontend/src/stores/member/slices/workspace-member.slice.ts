// src/stores/slices/workspaceMemberSlice.ts

import { StateCreator } from "zustand";
import { MemberStore } from "../memberStore";
import { MemberService } from "@/services/member.service";
import { WorkspaceMember } from "@/types";
import { InvitationUser } from "@/types/workspaceMember";

export enum EWorkspaceRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export interface UserLite {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
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
  workspaceMemberInvitationsMap: Record<string, Record<string,InvitationUser[]>>;
  workspaceMemberIds: string[];
  workspaceMemberInvitationIds: string[] | undefined;
}

const initialState: WorkspaceMemberSliceState = {
  workspaceMemberMap: {},
  workspaceMemberInvitationsMap: {},
  workspaceMemberIds: [],
  workspaceMemberInvitationIds: undefined,
};

interface WorkspaceMemberSliceActions {
  fetchWorkspaceMembers: (workspaceSlug: string) => Promise<WorkspaceMember[]>;
  fetchWorkspaceMemberInvitations: (workspaceSlug: string) => Promise<InvitationUser[]>;
  inviteMember: (workspaceSlug: string, email: string, role: string) => Promise<void>;
  updateMemberRole: (workspaceSlug: string, memberId: string, role: string) => Promise<WorkspaceMember>;
  removeMember: (workspaceSlug: string, memberId: string) => Promise<void>;
  // leaveWorkspace: (workspaceId: string) => Promise<void>;
  resetWorkspaceMember: () => void;
}

export type WorkspaceMemberSlice = WorkspaceMemberSliceState & WorkspaceMemberSliceActions;

const memberService = new MemberService();

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
      const response = await memberService.fetchWorkspaceMembers(workspaceSlug);
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
      })

      return response.members;
    } catch (error) {
      console.error("Error fetching workspace members:", error);
      throw error;
    }
  },
  fetchWorkspaceMemberInvitations: async (workspaceSlug: string) => {
    try {
      const response = await memberService.fetchWorkspaceMemberInvitations(workspaceSlug);
      const { invitations } = response;
      set((state) => {
        const newWorkspaceMemberInvitationsMap = { ...state.workspaceMemberInvitationsMap };
        const invitationMap: Record<string, InvitationUser[]> = {};

        invitations.forEach((invitation) => {
          if (!invitationMap[invitation.email]) {
            invitationMap[invitation.email] = [];
          }
          invitationMap[invitation.email].push(invitation);
        });

        newWorkspaceMemberInvitationsMap[workspaceSlug] = invitationMap;

        return {
          workspaceMemberInvitationsMap: newWorkspaceMemberInvitationsMap,
          workspaceMemberInvitationIds: invitations.map((invitation) => invitation.id),
        };
      });
      return invitations;
    } catch (error) {
      console.error("Error fetching workspace member invitations:", error);
      throw error;
    }
  },

  inviteMember: async (workspaceSlug: string, email: string, role: string)  => {
    try {
      await memberService.inviteMember(workspaceSlug, email, role);   
    } catch (error) {
      throw error;
    }
  },
  updateMemberRole: async (workspaceSlug: string, memberId: string, role: string) => {
    try {
      const response : any= await memberService.updateMemberRole(workspaceSlug, memberId, role);
      set((state) => {
        const newWorkspaceMemberMap = { ...state.workspaceMemberMap };
        if (newWorkspaceMemberMap[workspaceSlug] && newWorkspaceMemberMap[workspaceSlug][memberId]) {
          newWorkspaceMemberMap[workspaceSlug][memberId] = {
            ...newWorkspaceMemberMap[workspaceSlug][memberId],
            role,
          };
        }
        return { workspaceMemberMap: newWorkspaceMemberMap };
      });
      return response.data;
    } catch (error) {
      console.error("Error updating member role:", error);
      throw error;
    }
  },
  removeMember: async (workspaceSlug: string, memberId: string) => {
    try {
      await memberService.removeMember(workspaceSlug, memberId);
      set((state) => {
        const newWorkspaceMemberMap = { ...state.workspaceMemberMap };
        if (newWorkspaceMemberMap[workspaceSlug]) {
          delete newWorkspaceMemberMap[workspaceSlug][memberId];
        }
        return {
          workspaceMemberMap: newWorkspaceMemberMap,
          workspaceMemberIds: state.workspaceMemberIds.filter((id) => id !== memberId),
        };
      });
    } catch (error) {
      console.error("Error removing member:", error);
      throw error;
    }
  },
  resetWorkspaceMember: () => {
    set(initialState);
  },
});