import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { InviteWorkspaceDto } from "./dto/invite-workspace.dto";
import { PaginationQueryDto } from "src/user/dto/pagination-query.dto";

@Injectable()
export class WorkspaceInvitationsService {
  constructor(private prisma: PrismaService) {}
  async getInvitations(slug: string, paginationQueryDto: PaginationQueryDto) {
    const { page = 1, pageSize = 20 } = paginationQueryDto;
    const skip = (page - 1) * pageSize;

    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: slug },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with slug ${slug} not found`);
    }

    const [invitations, totalCount] = await Promise.all([
      this.prisma.workspaceInvitation.findMany({
        where: { workspaceId: workspace.id },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.workspaceInvitation.count({
        where: { workspaceId: workspace.id },
      }),
    ]);

    return {
      invitations: invitations.map((invitation) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        createdAt: invitation.createdAt,
      })),
      meta: {
        totalCount,
        page,
        pageSize,
      },
    };
  }

  async createInvitation(
    workspaceSlug: string,
    inviteWorkspaceDto: InviteWorkspaceDto,
  ) {
    const { email, role } = inviteWorkspaceDto;

    try {
      // First, check if the user with the given email exists
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException(
          `User with email ${email} does not exist`,
        );
      }

      // Find the workspace by slug
      const workspace = await this.prisma.workspace.findUnique({
        where: { slug: workspaceSlug },
      });

      if (!workspace) {
        throw new NotFoundException(
          `Workspace with slug ${workspaceSlug} not found`,
        );
      }

      // Check if the user is already a member of the workspace
      const existingMember = await this.prisma.workspaceMember.findFirst({
        where: {
          workspaceId: workspace.id,
          userId: user.id,
        },
      });

      if (existingMember) {
        throw new ConflictException(
          `User ${email} is already a member of this workspace`,
        );
      }

      // Create the invitation
      const invitation = await this.prisma.workspaceInvitation.create({
        data: {
          status: "PENDING",
          role: role ?? "MEMBER",
          email,
          workspaceId: workspace.id,
        },
        include: {
          workspace: true,
        },
      });

      return invitation;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      // Handle potential unique constraint violation
      if (error.code === "P2002") {
        throw new ConflictException(
          `An invitation for ${email} already exists in this workspace`,
        );
      }
      // Re-throw other errors
      throw error;
    }
  }
}
