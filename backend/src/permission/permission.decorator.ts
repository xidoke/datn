import { SetMetadata } from "@nestjs/common";
import { WorkspacePermission } from "./permission.type";

export const PERMISSIONS_KEY = "workspace_permissions";

export const Permissions = (...permissions: WorkspacePermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
