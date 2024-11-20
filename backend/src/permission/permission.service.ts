import { Injectable } from "@nestjs/common";
import { WorkspacePermission, WorkspaceRole } from "./permission.type";

@Injectable()
export class PermissionService {
  private rolePermissions: Record<WorkspaceRole, WorkspacePermission[]> = {
    [WorkspaceRole.OWNER]: [
      WorkspacePermission.CREATE_PROJECT,
      WorkspacePermission.INVITE_MEMBER,
      WorkspacePermission.REMOVE_MEMBER,
      WorkspacePermission.UPDATE_WORKSPACE,
      WorkspacePermission.DELETE_WORKSPACE,
      WorkspacePermission.VIEW_WORKSPACE,
    ],
    [WorkspaceRole.ADMIN]: [
      WorkspacePermission.CREATE_PROJECT,
      WorkspacePermission.INVITE_MEMBER,
      WorkspacePermission.REMOVE_MEMBER,
      WorkspacePermission.UPDATE_WORKSPACE,
      WorkspacePermission.VIEW_WORKSPACE,
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
