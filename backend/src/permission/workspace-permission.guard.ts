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

@Injectable()
export class WorkspacePermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<WorkspacePermission>(
      "workspace_permission",
      context.getHandler(),
    );
    if (!requiredPermission) {
      return true; // No permission required
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

    return this.permissionService.hasPermission(
      workspaceMember.role,
      requiredPermission,
    );
  }
}
