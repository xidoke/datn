import { Injectable } from "@nestjs/common";
import { WorkspacePermission, WorkspaceRole } from "./permission.type";

@Injectable()
export class PermissionService {
  private rolePermissions: Record<WorkspaceRole, WorkspacePermission[]> = {
    [WorkspaceRole.OWNER]: [
      // Workspace permissions
      WorkspacePermission.CREATE_PROJECT,
      WorkspacePermission.INVITE_MEMBER,
      WorkspacePermission.REMOVE_MEMBER,
      WorkspacePermission.ADD_MEMBER,
      WorkspacePermission.UPDATE_MEMBER_ROLE,
      WorkspacePermission.VIEW_INVITATIONS,
      WorkspacePermission.CANCEL_INVITATION,
      WorkspacePermission.UPDATE_WORKSPACE,
      WorkspacePermission.DELETE_WORKSPACE,
      WorkspacePermission.VIEW_WORKSPACE,
      // Project permissions
      WorkspacePermission.VIEW_PROJECT,
      WorkspacePermission.UPDATE_PROJECT,
      WorkspacePermission.DELETE_PROJECT,
      // Label permissions
      WorkspacePermission.CREATE_LABEL,
      WorkspacePermission.VIEW_LABEL,
      WorkspacePermission.UPDATE_LABEL,
      WorkspacePermission.DELETE_LABEL,
      // Issue permissions
      WorkspacePermission.CREATE_ISSUE,
      WorkspacePermission.VIEW_ISSUE,
      WorkspacePermission.UPDATE_ISSUE,
      WorkspacePermission.DELETE_ISSUE,
      WorkspacePermission.ASSIGN_ISSUE,
      // Comment permissions
      WorkspacePermission.CREATE_COMMENT,
      WorkspacePermission.VIEW_COMMENT,
      WorkspacePermission.UPDATE_COMMENT,
      WorkspacePermission.DELETE_COMMENT,
      // Attachment permissions
      WorkspacePermission.UPLOAD_ATTACHMENT,
      WorkspacePermission.VIEW_ATTACHMENT,
      WorkspacePermission.DELETE_ATTACHMENT,
      // Other permissions
      WorkspacePermission.MANAGE_PROJECT_SETTINGS,
      WorkspacePermission.VIEW_REPORTS,
      WorkspacePermission.GENERATE_REPORTS,
      WorkspacePermission.MANAGE_INTEGRATIONS,
      WorkspacePermission.MANAGE_WORKFLOW,
      WorkspacePermission.TRACK_TIME,
      WorkspacePermission.VIEW_TIME_LOGS,
      WorkspacePermission.API_ACCESS,
    ],
    [WorkspaceRole.ADMIN]: [
      // Workspace permissions
      WorkspacePermission.CREATE_PROJECT,
      WorkspacePermission.INVITE_MEMBER,
      WorkspacePermission.REMOVE_MEMBER,
      WorkspacePermission.ADD_MEMBER,
      WorkspacePermission.UPDATE_MEMBER_ROLE,
      WorkspacePermission.VIEW_INVITATIONS,
      WorkspacePermission.CANCEL_INVITATION,
      WorkspacePermission.UPDATE_WORKSPACE,
      WorkspacePermission.VIEW_WORKSPACE,
      // Project permissions
      WorkspacePermission.VIEW_PROJECT,
      WorkspacePermission.UPDATE_PROJECT,
      // Label permissions
      WorkspacePermission.CREATE_LABEL,
      WorkspacePermission.VIEW_LABEL,
      WorkspacePermission.UPDATE_LABEL,
      WorkspacePermission.DELETE_LABEL,
      // Issue permissions
      WorkspacePermission.CREATE_ISSUE,
      WorkspacePermission.VIEW_ISSUE,
      WorkspacePermission.UPDATE_ISSUE,
      WorkspacePermission.DELETE_ISSUE,
      WorkspacePermission.ASSIGN_ISSUE,
      // Comment permissions
      WorkspacePermission.CREATE_COMMENT,
      WorkspacePermission.VIEW_COMMENT,
      WorkspacePermission.UPDATE_COMMENT,
      WorkspacePermission.DELETE_COMMENT,
      // Attachment permissions
      WorkspacePermission.UPLOAD_ATTACHMENT,
      WorkspacePermission.VIEW_ATTACHMENT,
      WorkspacePermission.DELETE_ATTACHMENT,
      // Other permissions
      WorkspacePermission.MANAGE_PROJECT_SETTINGS,
      WorkspacePermission.VIEW_REPORTS,
      WorkspacePermission.GENERATE_REPORTS,
      WorkspacePermission.MANAGE_WORKFLOW,
      WorkspacePermission.TRACK_TIME,
      WorkspacePermission.VIEW_TIME_LOGS,
    ],
    [WorkspaceRole.MEMBER]: [
      WorkspacePermission.VIEW_WORKSPACE,
      WorkspacePermission.VIEW_PROJECT,
      WorkspacePermission.CREATE_ISSUE,
      WorkspacePermission.VIEW_ISSUE,
      WorkspacePermission.UPDATE_ISSUE,
      WorkspacePermission.ASSIGN_ISSUE,
      WorkspacePermission.CREATE_COMMENT,
      WorkspacePermission.VIEW_COMMENT,
      WorkspacePermission.UPDATE_COMMENT,
      WorkspacePermission.UPLOAD_ATTACHMENT,
      WorkspacePermission.VIEW_ATTACHMENT,
      WorkspacePermission.VIEW_LABEL,
      WorkspacePermission.TRACK_TIME,
      WorkspacePermission.VIEW_TIME_LOGS,
    ],
  };

  hasPermission(role: WorkspaceRole, permission: WorkspacePermission): boolean {
    return this.rolePermissions[role].includes(permission);
  }

  getPermissionsForRole(role: WorkspaceRole): WorkspacePermission[] {
    return this.rolePermissions[role];
  }
}