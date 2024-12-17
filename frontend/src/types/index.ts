import { InvitationUser, WorkspaceMember } from "./workspaceMember";


export * from "./user";
export * from "./workspace";
export type { WorkspaceMember } from "./workspaceMember";
export * from "./issue";
export type { IssueComment } from "./comment";
export type { Label } from "./label";
export type { Project } from "./project";
export * from "./state";
export type { IssueAssignee } from "./issueAssignee";
export * from "./invitations";


// dto
export * from "./dtos/register.dto";
export * from "./dtos/login.dto";
export interface ApiResponse<T> {
    status: boolean;
    path: string;
    message: string;
    statusCode: number;
    data: T;
    timestamp: string;
}

export interface MemberResponse {
  members: WorkspaceMember[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface InvitationsWorkspaceResponse {
  invitations: InvitationUser[];
  meta: {
    totalCOunt: number,
    page: number,
    pageSize: number
  }
}
