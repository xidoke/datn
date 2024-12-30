import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Project } from "@prisma/client";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
  }

  private getDefaultStates() {
    return [
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
  }

  async createProject(
    workspaceSlug: string,
    data: CreateProjectDto,
  ): Promise<Project> {
    let token: string;
    let isUnique = false;

    while (!isUnique) {
      token = this.generateToken();
      const existingProject = await this.prisma.project.findFirst({
        where: {
          token,
          workspace: { slug: workspaceSlug },
        },
      });
      isUnique = !existingProject;
    }

    const defaultStates = this.getDefaultStates();

    return this.prisma.project.create({
      data: {
        ...data,
        workspace: {
          connect: { slug: workspaceSlug },
        },
        token,
        states: {
          create: defaultStates,
        },
      },
      include: {
        states: true,
        workspace: true,
        _count: {
          select: {
            issues: true,
          },
        },
      },
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
    data: UpdateProjectDto,
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
