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

  async createProject(data: CreateProjectDto, workspaceSlug: string) {
    return this.prisma.$transaction(async (prisma) => {
      const project = await prisma.project.create({
        data: {
          ...data,
          workspace: { connect: { slug: workspaceSlug } },
        },
        include: {
          workspace: true,
        },
      });

      const defaultStates = [
        {
          name: "Backlog",
          color: "#9333ea",
          group: "backlog",
          description: "Initial state for new issues",
          isDefault: true,
        },
        {
          name: "Todo",
          color: "#3b82f6",
          group: "unstarted",
          description: "Issues to be worked on",
          isDefault: false,
        },
        {
          name: "In Progress",
          color: "#eab308",
          group: "started",
          description: "Issues currently being worked on",
          isDefault: false,
        },
        {
          name: "Done",
          color: "#22c55e",
          group: "completed",
          description: "Completed issues",
          isDefault: false,
        },
        {
          name: "Cancelled",
          color: "#ef4444",
          group: "cancelled",
          description: "Cancelled or abandoned issues",
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
      },
      include: {
        _count: {
          select: {
            issues: true,
          },
        },
        states: {
          select: {
            id: true,
            name: true,
            color: true,
            group: true,
            isDefault: true,
          },
        },
      },
    });
  }

  async getProject(workspaceSlug: string, projectId: string, userId: string) {
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

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: { slug: workspaceSlug },
      },
      include: {
        workspace: true,
        _count: {
          select: {
            issues: true,
          },
        },
        states: {
          select: {
            id: true,
            name: true,
            color: true,
            group: true,
            description: true,
            isDefault: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
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
      include: { workspace: true },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data,
      include: {
        workspace: true,
        _count: {
          select: {
            issues: true,
          },
        },
        states: {
          select: {
            id: true,
            name: true,
            color: true,
            group: true,
            description: true,
            isDefault: true,
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

    // Delete associated states
    await this.prisma.state.deleteMany({
      where: { projectId: projectId },
    });

    return this.prisma.project.delete({
      where: { id: projectId },
    });
  }
}
