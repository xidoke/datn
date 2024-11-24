// src/issues/issues.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
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
  ) {
    const { assigneeIds, labelIds, stateId, ...issueData } = createIssueDto;

    let effectiveStateId = stateId;

    if (!effectiveStateId) {
      // If no state is provided, find the default state for the project
      const defaultState = await this.prisma.state.findFirst({
        where: { projectId, isDefault: true },
      });

      if (!defaultState) {
        throw new Error("No default state found for this project");
      }

      effectiveStateId = defaultState.id;
    }

    return this.prisma.issue.create({
      data: {
        ...issueData,
        projectId,
        creatorId,
        stateId: effectiveStateId,
        assignees: {
          create: assigneeIds?.map((userId) => ({ userId })) || [],
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
            user: true,
          },
        },
        labels: true,
      },
    });
  }

  async findAll(projectId: string) {
    return this.prisma.issue.findMany({
      where: { projectId },
      include: {
        state: true,
        project: true,
        creator: true,
        assignees: {
          include: {
            user: true,
          },
        },
        labels: true,
      },
    });
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
            user: true,
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

    return issue;
  }

  async update(id: string, updateIssueDto: UpdateIssueDto) {
    const { assigneeIds, labelIds, ...issueData } = updateIssueDto;

    return this.prisma.issue.update({
      where: { id },
      data: {
        ...issueData,
        assignees: assigneeIds && {
          deleteMany: {},
          create: assigneeIds.map((userId) => ({ userId })),
        },
        labels: labelIds && {
          set: labelIds.map((id) => ({ id })),
        },
      },
      include: {
        state: true,
        project: true,
        creator: true,
        assignees: {
          include: {
            user: true,
          },
        },
        labels: true,
      },
    });
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
        // workspace: { slug: workspaceSlug },
        projectId: projectId,
        id: { in: issueIds },
      },
      include: {
        // workspace: true,
        project: true,
        state: true,
        // parent: true,
        assignees: true,
        labels: true,
        // modules: true,
        _count: {
          select: {
            // links: true,
            // attachments: true,
            // subIssues: true,
          },
        },
      },
      orderBy: this.getOrderBy(orderBy),
    });

    // Apply filters
    const filteredIssues = this.applyFilters(issues, filters);

    // Apply grouping
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
    // Example:
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
}
