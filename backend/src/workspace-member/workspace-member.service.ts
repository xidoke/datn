import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { WorkspaceRole } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";

@Injectable()
export class WorkspaceMemberService {
  constructor(private prisma: PrismaService) {}

  async getWorkspaceMembers(
    workspaceSlug: string,
    paginationQuery: PaginationQueryDto,
  ) {
    const { page = 1, pageSize = 20 } = paginationQuery;
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    });

    if (!workspace) {
      throw new NotFoundException(
        `Workspace with slug ${workspaceSlug} not found`,
      );
    }

    const skip = (page - 1) * pageSize;

    const [members, totalCount] = await Promise.all([
      this.prisma.workspaceMember.findMany({
        where: { workspaceId: workspace.id },
        include: {
          workspace: {
            select: { id: true, slug: true },
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { joinedAt: "desc" },
      }),
      this.prisma.workspaceMember.count({
        where: { workspaceId: workspace.id },
      }),
    ]);

    const formattedMembers = members.map((member) => ({
      id: member.id,
      userId: member.userId,
      role: member.role,
      workspaceSlug: member.workspace.slug,
      joinedAt: member.joinedAt.toISOString(),
      user: {
        id: member.user.id,
        email: member.user.email,
        firstName: member.user.firstName,
        lastName: member.user.lastName,
        avatarUrl: member.user.avatarUrl,
      },
    }));

    return {
      members: formattedMembers,
      totalCount,
      page,
      pageSize,
    };
  }

  async addMemberToWorkspace(
    workspaceSlug: string,
    email: string,
    role: WorkspaceRole,
    currentUserId: string,
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      include: { members: true },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    const currentUserMember = workspace.members.find(
      (member) => member.userId === currentUserId,
    );
    if (
      !currentUserMember ||
      (currentUserMember.role !== "ADMIN" &&
        workspace.ownerId !== currentUserId)
    ) {
      throw new ForbiddenException(
        "You do not have permission to add members to this workspace",
      );
    }

    const userToAdd = await this.prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
      throw new NotFoundException("User not found");
    }

    const existingMember = workspace.members.find(
      (member) => member.userId === userToAdd.id,
    );
    if (existingMember) {
      throw new BadRequestException(
        "User is already a member of this workspace",
      );
    }

    return this.prisma.workspaceMember.create({
      data: {
        workspace: { connect: { id: workspace.id } },
        user: { connect: { id: userToAdd.id } },
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async updateMemberRole(
    workspaceSlug: string,
    memberId: string,
    newRole: WorkspaceRole,
    currentUserId: string,
  ) {
    if (newRole === "OWNER") {
      throw new BadRequestException("Cannot change member role to OWNER");
    }

    if (newRole !== "ADMIN" && newRole !== "MEMBER") {
      throw new BadRequestException("Invalid role");
    }

    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      include: { members: true },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    const currentUserMember = workspace.members.find(
      (member) => member.userId === currentUserId,
    );
    if (
      !currentUserMember ||
      (currentUserMember.role !== "ADMIN" &&
        workspace.ownerId !== currentUserId)
    ) {
      throw new ForbiddenException(
        "You do not have permission to update member roles in this workspace",
      );
    }

    const memberToUpdate = workspace.members.find(
      (member) => member.id === memberId,
    );
    if (!memberToUpdate) {
      throw new NotFoundException("Member not found");
    }

    if (memberToUpdate.userId === workspace.ownerId) {
      throw new ForbiddenException(
        "Cannot change the role of the workspace owner",
      );
    }

    return this.prisma.workspaceMember.update({
      where: { id: memberId },
      data: { role: newRole },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async removeMemberFromWorkspace(
    workspaceSlug: string,
    memberId: string,
    currentUserId: string,
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      include: { members: true },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    const currentUserMember = workspace.members.find(
      (member) => member.userId === currentUserId,
    );
    if (
      !currentUserMember ||
      (currentUserMember.role !== "ADMIN" &&
        workspace.ownerId !== currentUserId)
    ) {
      throw new ForbiddenException(
        "You do not have permission to remove members from this workspace",
      );
    }

    const memberToRemove = workspace.members.find(
      (member) => member.id === memberId,
    );
    if (!memberToRemove) {
      throw new NotFoundException("Member not found");
    }

    if (memberToRemove.userId === workspace.ownerId) {
      throw new ForbiddenException("Cannot remove the workspace owner");
    }

    const { email } = await this.prisma.user.findUnique({
      where: { id: memberToRemove.userId },
      select: { email: true },
    });
    await this.prisma.workspaceMember.delete({ where: { id: memberId } });


    await this.prisma.workspaceInvitation.delete({
      where: {
        email_workspaceId: {
          workspaceId: workspace.id,
          email,
        },
      },
    });
    return { message: "Member removed successfully" };
  }
}
