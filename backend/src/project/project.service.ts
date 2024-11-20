import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(
    data: CreateProjectDto,
    workspaceSlug: string,
    userId: string,
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
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

    return this.prisma.$transaction(async (prisma) => {
      const project = await prisma.project.create({
        data: {
          ...data,
          workspace: { connect: { slug: workspaceSlug } },
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

      const defaultStates = [
        {
          name: "To Do",
          color: "#E2E8F0",
          group: "unstarted",
          order: 1,
          isDefault: true,
        },
        {
          name: "In Progress",
          color: "#3182CE",
          group: "started",
          order: 2,
          isDefault: false,
        },
        {
          name: "Done",
          color: "#38A169",
          group: "completed",
          order: 3,
          isDefault: false,
        },
      ];

      await prisma.state.createMany({
        data: defaultStates.map((state) => ({
          ...state,
          projectId: project.id,
        })),
      });

      // Fetch the created states to include in the response
      const states = await prisma.state.findMany({
        where: { projectId: project.id },
        orderBy: { order: "asc" },
      });

      return { ...project, states };
    });
  }

  async getProjects(workspaceSlug: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
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
        workspace: { slug: workspaceSlug },
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

  async getProject(workspaceSlug: string, projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: { slug: workspaceSlug },
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
    workspaceSlug: string,
    projectId: string,
    userId: string,
    data: { name?: string; description?: string },
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: { slug: workspaceSlug },
      },
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

  async deleteProject(
    workspaceSlug: string,
    projectId: string,
    userId: string,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: { slug: workspaceSlug },
      },
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
