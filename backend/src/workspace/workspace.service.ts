import {
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { WorkspaceRole } from "@prisma/client";
import { FileStorageService } from "src/file-storage/file-storage.service";
import { PermissionService } from "src/permission/permission.service";
import { PrismaService } from "src/prisma/prisma.service";

const RESTRICTED_WORKSPACE_SLUGS = [
  "admin",
  "api",
  "app",
  "dashboard",
  "create",
  "login",
  "register",
  "profile",
];

@Injectable()
export class WorkspaceService {
  constructor(
    private prisma: PrismaService,
    private fileStorageService: FileStorageService,
    private permissionService: PermissionService,
  ) {}

  async findBySlug(slug: string) {
    return this.prisma.workspace.findUnique({
      where: { slug },
      include: {
        owner: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    });
  }

  async checkWorkspaceAvailability(slug: string) {
    if (!slug || slug === "") {
      throw new BadRequestException("Workspace Slug is required");
    }

    const workspaceExists = await this.findBySlug(slug);

    const isAvailable =
      !workspaceExists && !RESTRICTED_WORKSPACE_SLUGS.includes(slug);

    return { status: isAvailable };
  }

  async getUserWorkspaces(userId: string, filters: { isOwner?: boolean } = {}) {
    const whereClause: any = {
      members: {
        some: {
          userId: userId,
        },
      },
    };

    // If owner filter is provided, filter by workspace creator
    if (filters.isOwner) {
      whereClause.ownerId = userId;
    }

    const workspaces = await this.prisma.workspace.findMany({
      where: whereClause,
      include: {
        owner: {
          select: {
            id: true,
          },
        },
        members: {
          where: {
            userId: userId,
          },
          select: {
            role: true,
          },
        },
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const formattedWorkspaces = workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      ownerId: workspace.owner.id,
      logoUrl: workspace.logoUrl,
      role: workspace.members[0].role,
      memberCount: workspace._count.members,
      projectCount: workspace._count.projects,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      permissions: this.permissionService.getPermissionsForRole(
        workspace.members[0].role,
      ),
    }));

    return {
      workspaces: formattedWorkspaces,
      totalCount: formattedWorkspaces.length,
    };
  }

  async createWorkspace(
    createWorkspaceDto: {
      name: string;
      slug: string;
    },
    userId: string,
  ) {
    const isAvailable = await this.checkWorkspaceAvailability(
      createWorkspaceDto.slug,
    );
    if (!isAvailable.status) {
      throw new ConflictException("Slug already exists");
    }
    try {
      return this.prisma.workspace.create({
        data: {
          name: createWorkspaceDto.name,
          slug: createWorkspaceDto.slug,
          ownerId: userId, // Set the creator as owner
          members: {
            create: {
              userId: userId,
              role: "OWNER", // The creator also gets ADMIN role in workspace_members
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getWorkspace(slug: string, userId: string) {
    const workspace = await this.findBySlug(slug);
    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    const member = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: workspace.id, userId: userId },
    });

    if (!member) {
      throw new ForbiddenException("You don't have access to this workspace");
    }

    return this.formatWorkspaceResponse(workspace, member.role);
  }

  private formatWorkspaceResponse(workspace: any, memberRole: WorkspaceRole) {
    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      ownerId: workspace.owner.id,
      logoUrl: workspace.logoUrl,
      role: memberRole,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      memberCount: workspace._count.members,
      projectCount: workspace._count.projects,
      permissions: this.permissionService.getPermissionsForRole(memberRole),
    };
  }

  async updateWorkspace(slug: string, userId: string, data: { name?: string }) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug },
      include: {
        members: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    // Check if user is owner or admin
    const member = workspace.members.find((m) => m.userId === userId);
    if (!member || (member.role !== "ADMIN" && workspace.ownerId !== userId)) {
      throw new ForbiddenException(
        "Only owners and admins can update the workspace",
      );
    }

    return this.prisma.workspace.update({
      where: { slug },
      data,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        },
        projects: true,
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
    });
  }

  async deleteWorkspace(userId: string, slug: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    // Only the owner can delete the workspace
    if (workspace.ownerId !== userId) {
      throw new BadRequestException(
        "Only the workspace owner can delete the workspace",
      );
    }

    // Use a transaction to ensure all operations are performed or none
    return this.prisma.$transaction(async (prisma) => {
      // Delete all workspace members
      await prisma.workspaceMember.deleteMany({
        where: { workspaceId: workspace.id },
      });

      // Get all project IDs associated with this workspace
      const projectIds = await prisma.project.findMany({
        where: { workspaceId: workspace.id },
        select: { id: true },
      });

      // Delete all issues associated with this workspace's projects
      await prisma.issue.deleteMany({
        where: { projectId: { in: projectIds.map((p) => p.id) } },
      });

      // Delete all projects associated with this workspace
      await prisma.project.deleteMany({
        where: { workspaceId: workspace.id },
      });

      // Delete any other related records here...

      // Finally, delete the workspace
      return prisma.workspace.delete({
        where: { id: workspace.id },
      });
    });
  }

  async updateWorkspaceLogo(slug: string, logo: Express.Multer.File) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug },
    });
    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    // Delete old logo if it exists
    if (workspace.logoUrl) {
      const oldLogoFilename = workspace.logoUrl.split("/").pop();
      if (oldLogoFilename) {
        await this.fileStorageService.deleteFile(oldLogoFilename);
      }
    }

    // Save new logo
    const savedFilename = await this.fileStorageService.saveFile(
      logo.buffer,
      logo.originalname,
    );
    const logoUrl = this.fileStorageService.getFileUrl(savedFilename);

    // Update workspace with new logo URL
    workspace.logoUrl = logoUrl;
    return this.prisma.workspace.update({
      where: { slug },
      data: { logoUrl },
    });
  }

  async getWorkspaceDashboard(slug: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug },
      include: {
        projects: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    const member = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: workspace.id, userId: userId },
    });

    if (!member) {
      throw new ForbiddenException("You don't have access to this workspace");
    }

    // Get current date
    const now = new Date();

    // Get assigned issues count
    const assignedCount = await this.prisma.issue.count({
      where: {
        projectId: {
          in: workspace.projects.map((p) => p.id),
        },
        assignees: {
          some: {
            userId: userId,
          },
        },
      },
    });

    // Get overdue issues count
    const overdueCount = await this.prisma.issue.count({
      where: {
        projectId: {
          in: workspace.projects.map((p) => p.id),
        },
        assignees: {
          some: {
            userId: userId,
          },
        },
        dueDate: {
          lt: now,
        },
        state: {
          group: {
            notIn: ["completed", "cancelled"],
          },
        },
      },
    });

    // Get created issues count
    const createdCount = await this.prisma.issue.count({
      where: {
        projectId: {
          in: workspace.projects.map((p) => p.id),
        },
        creatorId: userId,
      },
    });

    // Get completed issues count
    const completedCount = await this.prisma.issue.count({
      where: {
        projectId: {
          in: workspace.projects.map((p) => p.id),
        },
        state: {
          group: {
            in: ["completed"],
          },
        },
        creatorId: userId,
      },
    });

    // Get recent assigned issues
    const recentAssignedIssues = await this.prisma.issue.findMany({
      where: {
        projectId: {
          in: workspace.projects.map((p) => p.id),
        },
        assignees: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        priority: true,
        dueDate: true,
        sequenceNumber: true,
        state: {
          select: {
            name: true,
            group: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            token: true,
          },
        },
      },
    });

    // Get recent created issues
    const recentCreatedIssues = await this.prisma.issue.findMany({
      where: {
        projectId: {
          in: workspace.projects.map((p) => p.id),
        },
        creatorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        priority: true,
        sequenceNumber: true,
        state: {
          select: {
            name: true,
            group: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            token: true,
          },
        },
        assignees: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    // Get issues grouped by state
    const issuesByState = await this.prisma.issue.groupBy({
      by: ["stateId"],
      where: {
        projectId: {
          in: workspace.projects.map((p) => p.id),
        },
      },
      _count: {
        _all: true,
      },
    });

    // Fetch state information for the grouped issues
    const statesWithCounts = await Promise.all(
      issuesByState
        .filter((item) => item.stateId)
        .map(async (item) => {
          const state = await this.prisma.state.findUnique({
            where: { id: item.stateId },
            select: { name: true, group: true },
          });
          return {
            stateName: state?.name,
            stateGroup: state?.group,
            count: item._count._all,
          };
        }),
    );

    // Group the states by their group
    const issuesByStateGroup = statesWithCounts.reduce(
      (acc, item) => {
        if (!acc[item.stateGroup]) {
          acc[item.stateGroup] = 0;
        }
        acc[item.stateGroup] += item.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Convert the grouped data to an array format
    const issuesByStateGroupArray = Object.entries(issuesByStateGroup).map(
      ([group, count]) => ({
        group: group,
        count,
      }),
    );

    return {
      stats: {
        assignedCount,
        overdueCount,
        createdCount,
        completedCount,
      },
      recentAssignedIssues,
      recentCreatedIssues,
      issuesByStateGroup: issuesByStateGroupArray,
    };
  }
}
