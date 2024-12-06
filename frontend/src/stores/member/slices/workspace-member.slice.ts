// src/stores/slices/workspaceMemberSlice.ts

import { StateCreator } from "zustand";
import { MemberStore } from "../memberStore";
import { MemberService } from "@/services/member.service";
import { MemberResponse, User, WorkspaceMember } from "@/types";

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
  fetchWorkspaceMembers: (workspaceSlug: string) => Promise<WorkspaceMember[]>;
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
  inviteMember: async (workspaceSlug: string, email: string, role: string)  => {
    try {
      const workspaceMember = await memberService.inviteMember(workspaceSlug, email, role);
      set( (state) => {
        const newWorkspaceMemberMap = { ...state.workspaceMemberMap };
        if (newWorkspaceMemberMap[workspaceSlug]) {
          newWorkspaceMemberMap[workspaceSlug][workspaceMember.id] = workspaceMember;
        } else {
          newWorkspaceMemberMap[workspaceSlug] = { [workspaceMember.id]: workspaceMember };
        }
        return {
          workspaceMemberMap: newWorkspaceMemberMap,
          workspaceMemberIds: [...state.workspaceMemberIds, workspaceMember.id],
        };
      }

      );
      
        
    } catch (error) {
      console.error("Error inviting member:", error);
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