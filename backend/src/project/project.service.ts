import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(
    workspaceId: string,
    userId: string,
    data: { name: string; description?: string },
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    const member = workspace.members.find((m) => m.userId === userId);
    if (!member || (member.role !== "ADMIN" && workspace.ownerId !== userId)) {
      throw new BadRequestException(
        "Only workspace owners and admins can create projects",
      );
    }

    return this.prisma.project.create({
      data: {
        ...data,
        workspace: { connect: { id: workspaceId } },
        members: {
          create: {
            userId: userId,
            role: "ADMIN",
          },
        },
      },
      include: {
        workspace: true,
        members: {
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
        },
      },
    });
  }

  async getProjects(workspaceId: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    const member = workspace.members.find((m) => m.userId === userId);
    if (!member) {
      throw new BadRequestException("User is not a member of this workspace");
    }

    return this.prisma.project.findMany({
      where: {
        workspaceId: workspaceId,
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: {
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
        },
        _count: {
          select: {
            issues: true,
          },
        },
      },
    });
  }

  async getProject(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        workspace: true,
        members: {
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
        },
        _count: {
          select: {
            issues: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const member = project.members.find((m) => m.userId === userId);
    if (!member) {
      throw new BadRequestException("User is not a member of this project");
    }

    return project;
  }

  async updateProject(
    projectId: string,
    userId: string,
    data: { name?: string; description?: string },
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true, workspace: true },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const member = project.members.find((m) => m.userId === userId);
    if (
      !member ||
      (member.role !== "ADMIN" && project.workspace.ownerId !== userId)
    ) {
      throw new BadRequestException(
        "Only project admins and workspace owners can update projects",
      );
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data,
      include: {
        workspace: true,
        members: {
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
        },
        _count: {
          select: {
            issues: true,
          },
        },
      },
    });
  }

  async deleteProject(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { workspace: true },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    if (project.workspace.ownerId !== userId) {
      throw new BadRequestException(
        "Only workspace owners can delete projects",
      );
    }

    return this.prisma.project.delete({
      where: { id: projectId },
    });
  }
}
