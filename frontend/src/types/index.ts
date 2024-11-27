import { WorkspaceMember } from "./workspaceMember";

export type { User } from "./user";
export type { Workspace } from "./workspace";
export type { WorkspaceMember } from "./workspaceMember";
export type { Issue } from "./issue";
export type { IssueComment } from "./comment";
export type { Label } from "./label";
export type { Project } from "./project";
export type { State } from "./state";
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
