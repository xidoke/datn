import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { InviteWorkspaceDto } from "./dto/invite-workspace.dto";
import { InviteQueryDto } from "./dto/invite-query.dto";
import { WorkspaceRole } from "@prisma/client";

@Injectable()
export class WorkspaceInvitationsService {
  constructor(private prisma: PrismaService) {}

  async getInvitations(slug: string, inviteQueryDto: InviteQueryDto) {
    const { page = 1, pageSize = 1000, status } = inviteQueryDto;
    const skip = (page - 1) * pageSize;

    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: slug },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with slug ${slug} not found`);
    }

    const [invitations, totalCount] = await Promise.all([
      this.prisma.workspaceInvitation.findMany({
        where: {
          workspaceId: workspace.id,
          status: status ? { equals: status } : undefined,
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.workspaceInvitation.count({
        where: {
          workspaceId: workspace.id,
          status: status ? { equals: status } : undefined,
        },
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
      // Find the workspace by slug
      const workspace = await this.prisma.workspace.findUnique({
        where: { slug: workspaceSlug },
      });

      if (!workspace) {
        throw new NotFoundException(
          `Workspace with slug ${workspaceSlug} not found`,
        );
      }

      // Check if there's an existing invitation
      const existingInvitation =
        await this.prisma.workspaceInvitation.findFirst({
          where: {
            email,
            workspaceId: workspace.id,
          },
        });

      if (existingInvitation) {
        if (existingInvitation.status === "PENDING") {
          throw new ConflictException(
            `An invitation for ${email} already exists in this workspace`,
          );
        }

        // If the invitation was rejected, update it
        if (existingInvitation.status === "REJECTED") {
          const updatedInvitation =
            await this.prisma.workspaceInvitation.update({
              where: { id: existingInvitation.id },
              data: {
                status: "PENDING",
                role: role ?? "MEMBER",
              },
              include: {
                workspace: true,
              },
            });
          return updatedInvitation;
        }
      }

      // If no existing invitation or it's not rejected, proceed with creating a new one
      // First, check if the user with the given email exists
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException(
          `User with email ${email} does not exist`,
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

  async updateInvitationRole(
    workspaceSlug: string,
    invitationId: string,
    role: WorkspaceRole,
  ) {
    const invitation = await this.prisma.workspaceInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    const updatedInvitation = await this.prisma.workspaceInvitation.update({
      where: { id: invitationId },
      data: {
        role: role,
      },
      include: {
        workspace: true,
      },
    });

    return updatedInvitation;
  }

  async getInvitation(id: string) {
    const invitation = await this.prisma.workspaceInvitation.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!invitation) {
      throw new NotFoundException(`Invitation with id ${id} not found`);
    }

    return invitation;
  }

  async cancelInvitation(workspaceSlug: string, invitationId: string) {
    const invitation = await this.prisma.workspaceInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    await this.prisma.workspaceInvitation.delete({
      where: { id: invitationId },
    });

    return { message: "Invitation cancelled successfully" };
  }
}
