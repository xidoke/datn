import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class WorkspaceInvitationsService {
  constructor(private prisma: PrismaService) {}
  // TODO: Thêm permission cho phương thức này
  async getInvitations(slug: string) {
    return this.prisma.workspaceInvitation.findMany({
      where: {
        workspace: {
          slug: slug,
        },
      },
      include: {
        workspace: true,
      },
    });
  }

  // TODO: Thêm permission cho phương thức này
  // Phương thức để tạo lời mời mới sử dụng slug
  async createInvitation(email: string, workspaceSlug: string, role?: string) {
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

  // TODO: Thêm permission cho phương thức này
  // Phương thức để xóa lời mời sử dụng slug và email
  async deleteInvitation(email: string, workspaceSlug: string) {
    const invitation = await this.prisma.workspaceInvitation.deleteMany({
      where: {
        email,
        workspace: {
          slug: workspaceSlug,
        },
      },
    });

    return invitation;
  }
}
