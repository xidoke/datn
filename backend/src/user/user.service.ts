// src/user/user.service.ts

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "../auth/dto/login.dto";
import { Role } from "src/auth/enums/role.enum";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CognitoService } from "src/auth/cognito.service";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { CreateAdminUserDto } from "./dto/create-admin-user.dto";
import { FileStorageService } from "src/file-storage/file-storage.service";
import * as path from "path";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cognitoService: CognitoService,
    private fileStorageService: FileStorageService,
  ) {}

  // DONE
  async create(createUserDto: CreateAdminUserDto) {
    try {
      const cognitoUser = await this.cognitoService.createUser(
        createUserDto.email,
        createUserDto.password,
      );

      return this.prisma.user.create({
        data: {
          email: createUserDto.email,
          cognitoId: cognitoUser.User.Username,
          role: createUserDto.role ?? Role.USER, // Default role,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  // DONE
  async login(loginDto: LoginDto) {
    const authResult = await this.cognitoService.authenticateUser(
      loginDto.email,
      loginDto.password,
    );

    const user = await this.prisma.user.findFirst({
      where: { email: loginDto.email },
    });

    return {
      accessToken: authResult.AuthenticationResult.AccessToken,
      refreshToken: authResult.AuthenticationResult.RefreshToken,
      user,
    };
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, pageSize = 20, search = "" } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const [users] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          role: { not: Role.ADMIN },
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          cognitoId: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          isActive: true,
          role: true,
          lastWorkspaceSlug: true,
        },
      }),
    ]);

    return {
      users,
      totalCount: users.length,
      page,
      pageSize,
    };
  }

  async deleteUser(userId: string) {
    // First, fetch the user to get their Cognito ID
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { cognitoId: true, email: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    try {
      // Delete the user from Cognito
      await this.cognitoService.deleteUser(user.cognitoId);

      // Delete the user from the database
      const deletedUser = await this.prisma.$transaction(async (prisma) => {
        // You might want to handle cascading deletes here, depending on your data model
        // For example, delete related records in other tables

        return prisma.user.delete({
          where: { id: userId },
        });
      });

      return {
        message: "User successfully deleted",
        userId: deletedUser.id,
        email: deletedUser.email,
      };
    } catch (error) {
      // Log the error for debugging
      console.error("Error deleting user:", error);

      // If Cognito deletion succeeded but database deletion failed,
      // you might want to implement a cleanup or reconciliation process

      throw new InternalServerErrorException("Failed to delete user");
    }
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByCognitoId(cognitoId: string) {
    return this.prisma.user.findUnique({
      where: { cognitoId },
    });
  }

  async globalSignOut(userId: string) {
    return this.cognitoService.globalSignOut(userId);
  }

  async forgotPassword(email: string) {
    return this.cognitoService.forgotPassword(email);
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    return this.cognitoService.confirmForgotPassword(email, code, newPassword);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async setIsActive(id: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.cognitoService.changePassword(
      user.cognitoId,
      oldPassword,
      newPassword,
    );
    return user;
  }

  async updateAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ avatarUrl: string }> {
    if (!file || !file.buffer) {
      throw new BadRequestException("Invalid file");
    }

    // Validate file type
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        "Invalid file type. Only JPEG, PNG, and GIF are allowed.",
      );
    }

    // Validate file size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException("File size exceeds the 5MB limit.");
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Delete old avatar if it exists
    if (user.avatarUrl) {
      const oldAvatarFilename = path.basename(user.avatarUrl);
      await this.fileStorageService.deleteFile(oldAvatarFilename);
    }

    // Save new avatar
    const savedFilename = await this.fileStorageService.saveFile(
      file.buffer,
      file.originalname,
    );
    const avatarUrl = this.fileStorageService.getFileUrl(savedFilename);

    // Update user with new avatar URL
    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    return { avatarUrl };
  }

  async getInvitations(email: string, status?: string) {
    const invitations = await this.prisma.workspaceInvitation.findMany({
      where: {
        email: email,
        status: status ? { equals: status } : undefined,
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
      },
    });

    return {
      invitations: invitations.map((invitation) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        workspace: invitation.workspace,
        createdAt: invitation.createdAt,
        updatedAt: invitation.updatedAt,
      })),
      totalCount: invitations.length,
    };
  }

  async acceptInvitation(invitationId: string, userId: string) {
    const invitation = await this.prisma.workspaceInvitation.findUnique({
      where: { id: invitationId },
      include: { workspace: true },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    if (invitation.status !== "PENDING") {
      throw new BadRequestException("Invitation is no longer valid");
    }

    if (
      invitation.email !==
      (await this.prisma.user.findUnique({ where: { id: userId } }))?.email
    ) {
      throw new BadRequestException("This invitation is not for you");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [updatedWorkspace, _] = await this.prisma.$transaction([
      this.prisma.workspace.update({
        where: { id: invitation.workspaceId },
        data: {
          members: {
            create: {
              userId: userId,
              role: invitation.role,
            },
          },
        },
      }),
      this.prisma.workspaceInvitation.update({
        where: { id: invitationId },
        data: {
          status: "ACCEPTED",
        },
      }),
    ]);

    return {
      message: "Invitation accepted successfully",
      workspace: {
        id: updatedWorkspace.id,
        name: updatedWorkspace.name,
        slug: updatedWorkspace.slug,
      },
    };
  }

  async rejectInvitation(invitationId: string, userId: string) {
    const invitation = await this.prisma.workspaceInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    if (invitation.status !== "PENDING") {
      throw new BadRequestException("Invitation is no longer valid");
    }

    if (
      invitation.email !==
      (await this.prisma.user.findUnique({ where: { id: userId } }))?.email
    ) {
      throw new BadRequestException("This invitation is not for you");
    }

    await this.prisma.workspaceInvitation.update({
      where: { id: invitationId },
      data: {
        status: "REJECTED",
      },
    });

    return {
      message: "Invitation rejected successfully",
    };
  }

  async getChartData() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentDate = new Date();
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    const startDate = new Date(
      endDate.getFullYear() - 1,
      endDate.getMonth() + 1,
      1,
    );

    const [users, workspaces, projects, issues] = await Promise.all([
      this.prisma.user.groupBy({
        by: ["createdAt"],
        _count: { id: true },
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),
      this.prisma.workspace.groupBy({
        by: ["createdAt"],
        _count: { id: true },
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),
      this.prisma.project.groupBy({
        by: ["createdAt"],
        _count: { id: true },
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),
      this.prisma.issue.groupBy({
        by: ["createdAt"],
        _count: { id: true },
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),
    ]);

    const chartData = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(
        endDate.getFullYear(),
        endDate.getMonth() - index,
        1,
      );
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;

      return {
        month: months[date.getMonth()],
        year: date.getFullYear(),
        users: 0,
        workspaces: 0,
        projects: 0,
        issues: 0,
      };
    }).reverse();

    const updateCounts = (data, key) => {
      data.forEach((item) => {
        const monthKey = `${item.createdAt.getFullYear()}-${(item.createdAt.getMonth() + 1).toString().padStart(2, "0")}`;
        const chartItem = chartData.find(
          (d) =>
            `${d.year}-${(months.indexOf(d.month) + 1).toString().padStart(2, "0")}` ===
            monthKey,
        );
        if (chartItem) {
          chartItem[key] += item._count.id;
        }
      });
    };

    updateCounts(users, "users");
    updateCounts(workspaces, "workspaces");
    updateCounts(projects, "projects");
    updateCounts(issues, "issues");

    return chartData;
  }

  async getMetrics() {
    const totalUsers = await this.prisma.user.count();
    const totalWorkspaces = await this.prisma.workspace.count();
    const totalProjects = await this.prisma.project.count();
    const totalIssues = await this.prisma.issue.count();

    return {
      totalUsers,
      totalWorkspaces,
      totalProjects,
      totalIssues,
    };
  }
}
