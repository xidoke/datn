import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
  constructor(private prisma: PrismaService) {}

  async findBySlug(slug: string) {
    return this.prisma.workspace.findUnique({
      where: { slug },
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
                role: true,
              },
            },
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        _count: {
          select: {
            projects: true,
            members: true,
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

  async getUserWorkspaces(userId: string, filters: { owner?: string } = {}) {
    const whereClause: any = {
      members: {
        some: {
          userId: userId,
        },
      },
    };

    // If owner filter is provided, filter by workspace creator
    if (filters.owner) {
      whereClause.ownerId = filters.owner;
    }

    return this.prisma.workspace.findMany({
      where: whereClause,
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
        projects: {
          select: {
            id: true,
            name: true,
            description: true,
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
  }

  async createWorkspace(data: { name: string; userId: string; slug: string }) {
    try {
      const isAvailable = await this.checkWorkspaceAvailability(data.slug);
      if (!isAvailable.status) {
        throw new BadRequestException("Slug already exists");
      }

      return this.prisma.workspace.create({
        data: {
          name: data.name,
          slug: data.slug,
          ownerId: data.userId, // Set the creator as owner
          members: {
            create: {
              userId: data.userId,
              role: "ADMIN", // The creator also gets ADMIN role in workspace_members
            },
          },
        },
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
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async getWorkspace(slug: string, userId: string) {
    const workspace = await this.findBySlug(slug);
    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }
    const isMember = workspace.members.some(
      (member) => member.userId === userId,
    );
    if (!isMember) {
      throw new BadRequestException("You don't have access to this workspace");
    }
    return workspace;
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
      throw new BadRequestException(
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
      throw new NotFoundException('Workspace not found');
    }

    // Only the owner can delete the workspace
    if (workspace.ownerId !== userId) {
      throw new BadRequestException(
        'Only the workspace owner can delete the workspace'
      );
    }

    // Use a transaction to ensure all operations are performed or none
    return this.prisma.$transaction(async (prisma) => {
      // Delete all workspace members
      await prisma.workspaceMember.deleteMany({
        where: { workspaceId: workspace.id },
      });

      // Delete all projects associated with this workspace
      await prisma.project.deleteMany({
        where: { workspaceId: workspace.id },
      });

      // Delete all issues associated with this workspace's projects
      await prisma.issue.deleteMany({
        where: { project: { workspaceId: workspace.id } },
      });

      // Delete any other related records here...

      // Finally, delete the workspace
      return prisma.workspace.delete({
        where: { id: workspace.id },
      });
    });
  }
}
