import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateIssueDto } from "./dto/create-issue.dto";
import { UpdateIssueDto } from "./dto/update-issue.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createIssueDto: CreateIssueDto,
    projectId: string,
    creatorId: string,
    workspaceSlug: string,
  ) {
    const { assigneeIds, labelIds, stateId, ...issueData } = createIssueDto;

    return this.prisma.$transaction(async (prisma) => {
      const project = await prisma.project.findFirst({
        where: { id: projectId, workspace: { slug: workspaceSlug } },
        select: {
          id: true,
          lastIssueNumber: true,
          token: true,
          workspaceId: true,
        },
      });

      if (!project) {
        throw new NotFoundException(
          `Project not found in workspace ${workspaceSlug}`,
        );
      }

      let effectiveStateId = stateId;
      if (!effectiveStateId) {
        const defaultState = await prisma.state.findFirst({
          where: { projectId, isDefault: true },
          select: { id: true },
        });
        if (!defaultState) {
          throw new BadRequestException(
            "No default state found for this project",
          );
        }
        effectiveStateId = defaultState.id;
      }

      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: { lastIssueNumber: { increment: 1 } },
        select: { lastIssueNumber: true },
      });

      // Find corresponding WorkspaceMembers for the assigneeIds
      const workspaceMembers = await prisma.workspaceMember.findMany({
        where: {
          userId: { in: assigneeIds || [] },
          workspaceId: project.workspaceId,
        },
      });

      const newIssue = await prisma.issue.create({
        data: {
          ...issueData,
          projectId,
          creatorId,
          stateId: effectiveStateId,
          sequenceNumber: updatedProject.lastIssueNumber,
          assignees: {
            create: workspaceMembers.map((member) => ({
              memberId: member.userId,
              workspaceId: member.workspaceId,
            })),
          },
          labels: {
            connect: labelIds?.map((id) => ({ id })) || [],
          },
        },
        include: {
          state: true,
          project: true,
          creator: true,
          assignees: {
            include: {
              workspaceMember: {
                include: {
                  user: true,
                },
              },
            },
          },
          labels: true,
        },
      });

      return {
        ...newIssue,
        fullIdentifier: `${project.token}-${newIssue.sequenceNumber}`,
      };
    });
  }

  async findAll(
    projectId: string,
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: "asc" | "desc",
  ) {
    const skip = (page - 1) * pageSize;
    const issues = await this.prisma.issue.findMany({
      where: { projectId },
      include: {
        state: true,
        project: true,
        creator: true,
        assignees: {
          include: {
            workspaceMember: {
              include: {
                user: true,
              },
            },
          },
        },
        labels: true,
      },
      skip,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
    });

    const totalCount = await this.prisma.issue.count({ where: { projectId } });

    return {
      issues: issues.map((issue) => ({
        ...issue,
        fullIdentifier: `${issue.project.token}-${issue.sequenceNumber}`,
      })),
      pagination: {
        totalCount,
        page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }

  async findOne(id: string) {
    const issue = await this.prisma.issue.findUnique({
      where: { id },
      include: {
        state: true,
        project: true,
        creator: true,
        assignees: {
          include: {
            workspaceMember: {
              include: {
                user: true,
              },
            },
          },
        },
        labels: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }

    return {
      ...issue,
      fullIdentifier: `${issue.project.token}-${issue.sequenceNumber}`,
    };
  }

  async update(id: string, updateIssueDto: UpdateIssueDto) {
    const { assigneeIds, labelIds, ...issueData } = updateIssueDto;

    // Validate that the issue exists
    const existingIssue = await this.prisma.issue.findUnique({
      where: { id },
      include: { project: true },
    });
    if (!existingIssue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }

    // Validate assignees
    if (assigneeIds && assigneeIds.length > 0) {
      const validWorkspaceMembers = await this.prisma.workspaceMember.findMany({
        where: {
          userId: { in: assigneeIds },
          workspaceId: existingIssue.project.workspaceId,
        },
        select: { userId: true },
      });

      const validAssigneeIds = validWorkspaceMembers.map(
        (member) => member.userId,
      );
      const invalidAssigneeIds = assigneeIds.filter(
        (id) => !validAssigneeIds.includes(id),
      );

      if (invalidAssigneeIds.length > 0) {
        throw new BadRequestException({
          message: "Invalid assignee IDs detected",
          invalidIds: invalidAssigneeIds,
          details:
            "These user IDs do not exist in the workspace or are not valid assignees for this project.",
        });
      }
    }

    // Validate labels
    if (labelIds && labelIds.length > 0) {
      const validLabelIds = await this.prisma.label.findMany({
        where: {
          id: { in: labelIds },
          projectId: existingIssue.projectId,
        },
        select: { id: true },
      });

      const invalidLabelIds = labelIds.filter(
        (id) => !validLabelIds.map((label) => label.id).includes(id),
      );

      if (invalidLabelIds.length > 0) {
        throw new BadRequestException({
          message: "Invalid label IDs detected",
          invalidIds: invalidLabelIds,
          details:
            "These label IDs do not exist in the database or are not associated with this project.",
        });
      }
    }

    try {
      const updatedIssue = await this.prisma.issue.update({
        where: { id },
        data: {
          ...issueData,
          assignees: assigneeIds
            ? {
                deleteMany: {}, // Delete all existing assignees
                create: assigneeIds.map((userId) => ({
                  memberId: userId,
                  workspaceId: existingIssue.project.workspaceId,
                })),
              }
            : undefined,
          // Xử lý labels
          labels: labelIds === undefined
            ? undefined // Không thay đổi
            : labelIds === null
              ? { set: [] } // Xóa tất cả labels
              : { set: labelIds.map((id) => ({ id })) }, // Cập nhật labels
        },
        include: {
          state: true,
          project: true,
          creator: true,
          assignees: {
            include: {
              workspaceMember: {
                include: {
                  user: true,
                },
              },
            },
          },
          labels: true,
        },
      });

      return {
        ...updatedIssue,
        fullIdentifier: `${updatedIssue.project.token}-${updatedIssue.sequenceNumber}`,
      };
    } catch (error) {
      if (error.code === "P2002") {
        throw new BadRequestException(
          "Unique constraint violated. This could be due to a duplicate label or state.",
        );
      }
      if (error.code === "P2003") {
        throw new BadRequestException(
          "Foreign key constraint violated. This could be due to an invalid label ID or state ID.",
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    return this.prisma.issue.delete({
      where: { id },
    });
  }

  async getIssuesList({
    projectId,
    issueIds,
    orderBy,
    groupBy,
    subGroupBy,
    filters,
  }) {
    const issues = await this.prisma.issue.findMany({
      where: {
        projectId: projectId,
        id: { in: issueIds },
      },
      include: {
        project: true,
        state: true,
        assignees: {
          include: {
            workspaceMember: {
              include: {
                user: true,
              },
            },
          },
        },
        labels: true,
        _count: {
          select: {},
        },
      },
      orderBy: this.getOrderBy(orderBy),
    });

    const issuesWithFullIdentifier = issues.map((issue) => ({
      ...issue,
      fullIdentifier: `${issue.project.token}-${issue.sequenceNumber}`,
    }));

    const filteredIssues = this.applyFilters(issuesWithFullIdentifier, filters);
    const groupedIssues = this.applyGrouping(
      filteredIssues,
      groupBy,
      subGroupBy,
    );

    return groupedIssues;
  }

  private getOrderBy(orderBy: string): Prisma.IssueOrderByWithRelationInput {
    const [field, direction] = orderBy.split(":");
    return { [field]: direction.toLowerCase() };
  }

  private applyFilters(issues, filters) {
    // Implement filter logic here
    if (filters.state) {
      return issues.filter((issue) => issue.state.id === filters.state);
    }
    // Add more filters as needed
    return issues;
  }

  private applyGrouping(issues, groupBy, subGroupBy) {
    if (!groupBy) return issues;

    const groupedIssues = issues.reduce((acc, issue) => {
      const groupKey = issue[groupBy];
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(issue);
      return acc;
    }, {});

    if (subGroupBy) {
      Object.keys(groupedIssues).forEach((key) => {
        groupedIssues[key] = this.applyGrouping(
          groupedIssues[key],
          subGroupBy,
          null,
        );
      });
    }

    return groupedIssues;
  }

  async updateRecentVisitedTask(
    workspaceSlug: string,
    projectId: string,
    userId: string,
  ) {
    // Implement logic to update recent visited task
    // This could involve updating a user's metadata or a separate table tracking recent activities
    console.log(
      `Updating recent visited task for user ${userId} in project ${projectId} of workspace ${workspaceSlug}`,
    );
  }
}
