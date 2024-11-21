import { Injectable } from "@nestjs/common";
import { WorkspacePermission, WorkspaceRole } from "./permission.type";

@Injectable()
export class PermissionService {
  private rolePermissions: Record<WorkspaceRole, WorkspacePermission[]> = {
    [WorkspaceRole.OWNER]: [
      // * workspace permissions
      WorkspacePermission.UPDATE_WORKSPACE,
      WorkspacePermission.DELETE_WORKSPACE,
      WorkspacePermission.VIEW_WORKSPACE,
      // * member permissions
      WorkspacePermission.INVITE_MEMBER,
      WorkspacePermission.REMOVE_MEMBER,
      WorkspacePermission.UPDATE_MEMBER_ROLE,
      // * project permissions
      WorkspacePermission.VIEW_INVITATIONS,
      WorkspacePermission.CANCEL_INVITATION,
      // * project permissions
      WorkspacePermission.CREATE_PROJECT,
    ],
    [WorkspaceRole.ADMIN]: [
      // * workspace permissions
      WorkspacePermission.UPDATE_WORKSPACE,
      // WorkspacePermission.DELETE_WORKSPACE,
      WorkspacePermission.VIEW_WORKSPACE,
      // * member permissions
      WorkspacePermission.INVITE_MEMBER,
      WorkspacePermission.REMOVE_MEMBER,
      WorkspacePermission.UPDATE_MEMBER_ROLE,
      // * project permissions
      WorkspacePermission.VIEW_INVITATIONS,
      WorkspacePermission.CANCEL_INVITATION,
      // * project permissions
      WorkspacePermission.CREATE_PROJECT,
    ],
    [WorkspaceRole.MEMBER]: [
      WorkspacePermission.CREATE_PROJECT,
      WorkspacePermission.VIEW_WORKSPACE,
    ],
  };

  hasPermission(role: WorkspaceRole, permission: WorkspacePermission): boolean {
    return this.rolePermissions[role].includes(permission);
  }

  getPermissionsForRole(role: WorkspaceRole): WorkspacePermission[] {
    return this.rolePermissions[role];
  }
}
