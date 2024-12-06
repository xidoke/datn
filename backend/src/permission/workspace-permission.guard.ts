import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "src/prisma/prisma.service";
import { PermissionService } from "./permission.service";
import { WorkspacePermission } from "./permission.type";
import { PERMISSIONS_KEY } from "./permission.decorator";

@Injectable()
export class WorkspacePermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<WorkspacePermission[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const workspaceSlug = request.params.workspaceSlug || request.params.slug;

    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    });
    if (!workspace) {
      throw new ForbiddenException("Workspace not found");
    }
    const workspaceMember = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.userId,
          workspaceId: workspace.id,
        },
      },
    });

    if (!workspaceMember) {
      throw new ForbiddenException("You are not a member of this workspace");
    }

    const isPass = requiredPermissions.every((permission) =>
      this.permissionService.hasPermission(workspaceMember.role, permission),
    );
    console.log("workspace member role:", workspaceMember.role);
    console.log("Checking permission:", isPass, requiredPermissions);

    return isPass;
  }
}
