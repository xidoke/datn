/* eslint-disable @typescript-eslint/no-explicit-any */
// src/stores/slices/workspaceMemberSlice.ts

import { StateCreator } from "zustand";
import { MemberStore } from "../memberStore";
import { MemberService } from "@/services/member.service";
import { Invitation, WorkspaceMember } from "@/types";

export enum EWorkspaceRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
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
  workspacesMemberMap: Record<string, Record<string, WorkspaceMember>>;
  workspaceMemberInvitationsMap: Record<string, Record<string,Invitation>>;
  workspaceMemberIds: string[];
  workspaceMemberInvitationIds: string[] | undefined;
}

const initialState: WorkspaceMemberSliceState = {
  workspacesMemberMap: {},
  workspaceMemberInvitationsMap: {},
  workspaceMemberIds: [],
  workspaceMemberInvitationIds: [],
};

interface WorkspaceMemberSliceActions {
  fetchWorkspaceMembers: (workspaceSlug: string) => Promise<WorkspaceMember[]>;
  fetchWorkspaceMemberInvitations: (workspaceSlug: string) => Promise<Invitation[]>;
  inviteMember: (workspaceSlug: string, email: string, role: string) => Promise<void>;
  updateMemberRole: (workspaceSlug: string, memberId: string, role: string) => Promise<WorkspaceMember>;
  removeMember: (workspaceSlug: string, memberId: string) => Promise<void>;
  // leaveWorkspace: (workspaceId: string) => Promise<void>;
  deleteInvitation: (workspaceSlug: string, invitationId: string) => Promise<void>;

  updateInvitationRole: (workspaceSlug: string, invitationId: string, role: string) => Promise<Invitation>;
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
        const newWorkspaceMemberMap = { ...state.workspacesMemberMap };
        const memberMap: Record<string, WorkspaceMember> = {};

        workspaceMembers.forEach((member) => {
          memberMap[member.id] = member;
        });

        newWorkspaceMemberMap[workspaceSlug] = memberMap;

        return {
          workspacesMemberMap: newWorkspaceMemberMap,
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
        const invitationMap: Record<string, Invitation> = {};

        invitations.forEach((invitation) => {
          invitationMap[invitation.id] = invitation;
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

  deleteInvitation: async (workspaceSlug: string, invitationId: string) => {
    try {
      await memberService.deleteInvitation(workspaceSlug, invitationId);
      set((state) => {
        const newWorkspaceMemberInvitationsMap = { ...state.workspaceMemberInvitationsMap };
        if (newWorkspaceMemberInvitationsMap[workspaceSlug]) {
          delete newWorkspaceMemberInvitationsMap[workspaceSlug][invitationId];
        }
        return {
          workspaceMemberInvitationsMap: newWorkspaceMemberInvitationsMap,
          workspaceMemberInvitationIds: state.workspaceMemberInvitationIds?.filter((id) => id !== invitationId),
        };
      });
    } catch (error) {
      console.error("Error deleting invitation:", error);
      throw error;
    }
  },

  updateInvitationRole: async (workspaceSlug: string, invitationId: string, role: string) => {
    try {
      const response = await memberService.updateInvitationRole(workspaceSlug, invitationId, role);
      set((state) => {
        const newWorkspaceMemberInvitationsMap = { ...state.workspaceMemberInvitationsMap };
        if (newWorkspaceMemberInvitationsMap[workspaceSlug] && newWorkspaceMemberInvitationsMap[workspaceSlug][invitationId]) {
          newWorkspaceMemberInvitationsMap[workspaceSlug][invitationId] = {
            ...newWorkspaceMemberInvitationsMap[workspaceSlug][invitationId],
            role,
          };
        }
        return { workspaceMemberInvitationsMap: newWorkspaceMemberInvitationsMap };
      });
      return response;
    } catch (error) {
      console.error("Error updating invitation role:", error);
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
        const newWorkspaceMemberMap = { ...state.workspacesMemberMap };
        if (newWorkspaceMemberMap[workspaceSlug] && newWorkspaceMemberMap[workspaceSlug][memberId]) {
          newWorkspaceMemberMap[workspaceSlug][memberId] = {
            ...newWorkspaceMemberMap[workspaceSlug][memberId],
            role,
          };
        }
        return { workspacesMemberMap: newWorkspaceMemberMap };
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
        const newWorkspaceMemberMap = { ...state.workspacesMemberMap };
        if (newWorkspaceMemberMap[workspaceSlug]) {
          delete newWorkspaceMemberMap[workspaceSlug][memberId];
        }
        return {
          workspacesMemberMap: newWorkspaceMemberMap,
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