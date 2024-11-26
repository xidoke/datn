import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Label, Prisma } from "@prisma/client";
import { CreateLabelDto } from "./dto/create-label.dto";
import { UpdateLabelDto } from "./dto/update-label.dto";

@Injectable()
export class LabelService {
  constructor(private prisma: PrismaService) {}

  async getLabels(projectId: string): Promise<Label[]> {
    return this.prisma.label.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });
  }

  async getLabel(projectId: string, labelId: string): Promise<Label> {
    const label = await this.prisma.label.findFirst({
      where: {
        id: labelId,
        projectId,
      },
    });

    if (!label) {
      throw new NotFoundException(
        `Label with ID ${labelId} not found in project ${projectId}`,
      );
    }

    return label;
  }

  async createLabel(
    projectId: string,
    createLabelDto: CreateLabelDto,
  ): Promise<Label> {
    const { name, color } = createLabelDto;
    return this.prisma.label.create({
      data: {
        name,
        color,
        project: {
          connect: { id: projectId },
        },
      },
    });
  }

  async updateLabel(
    projectId: string,
    labelId: string,
    updateLabelDto: UpdateLabelDto,
  ): Promise<Label> {
    const label = await this.getLabel(projectId, labelId);
    return this.prisma.label.update({
      where: { id: label.id },
      data: updateLabelDto,
    });
  }

  async deleteLabel(projectId: string, labelId: string): Promise<Label> {
    const label = await this.getLabel(projectId, labelId);
    return this.prisma.label.delete({
      where: { id: label.id },
    });
  }

  async createLabels(
    projectId: string,
    data: CreateLabelDto[],
  ): Promise<Prisma.BatchPayload> {
    const existingLabels = await this.prisma.label.findMany({
      where: { projectId },
      select: { name: true },
    });
    const existingNames = new Set(
      existingLabels.map((label) => label.name.toLowerCase()),
    );

    const newLabels = data.filter(
      (label) => !existingNames.has(label.name.toLowerCase()),
    );

    if (newLabels.length !== data.length) {
      throw new ConflictException(
        "Some label names already exist in this project",
      );
    }

    return this.prisma.label.createMany({
      data: newLabels.map((label) => ({
        ...label,
        projectId,
      })),
    });
  }

  async labelExists(projectId: string, labelId: string): Promise<boolean> {
    const label = await this.prisma.label.findFirst({
      where: {
        id: labelId,
        projectId,
      },
      select: { id: true },
    });
    return !!label;
  }

  async updateLabels(
    projectId: string,
    data: { id: string; data: Prisma.LabelUpdateInput }[],
  ): Promise<Prisma.BatchPayload> {
    const labelIds = data.map((item) => item.id);
    const existingLabels = await this.prisma.label.findMany({
      where: { id: { in: labelIds }, projectId },
      select: { id: true },
    });

    if (existingLabels.length !== labelIds.length) {
      throw new NotFoundException("Some labels were not found");
    }

    const updateOperations = data.map(({ id, data }) =>
      this.prisma.label.updateMany({
        where: { id, projectId },
        data,
      }),
    );

    const results = await this.prisma.$transaction(updateOperations);
    return { count: results.reduce((sum, result) => sum + result.count, 0) };
  }

  async deleteLabels(
    projectId: string,
    labelIds: string[],
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.label.deleteMany({
      where: {
        id: { in: labelIds },
        projectId,
      },
    });
  }

  async getIssueLabels(projectId: string, issueId: string): Promise<Label[]> {
    return this.prisma.label.findMany({
      where: {
        projectId,
        issues: {
          some: { id: issueId },
        },
      },
    });
  }

  async addIssueLabel(
    projectId: string,
    issueId: string,
    labelId: string,
  ): Promise<void> {
    await this.prisma.issue.update({
      where: {
        id: issueId,
        projectId,
      },
      data: {
        labels: {
          connect: { id: labelId },
        },
      },
    });
  }

  async deleteIssueLabel(
    projectId: string,
    issueId: string,
    labelId: string,
  ): Promise<void> {
    await this.prisma.issue.update({
      where: {
        id: issueId,
        projectId,
      },
      data: {
        labels: {
          disconnect: { id: labelId },
        },
      },
    });
  }

  async addIssueLabels(
    projectId: string,
    issueId: string,
    labelIds: string[],
  ): Promise<void> {
    await this.prisma.issue.update({
      where: {
        id: issueId,
        projectId,
      },
      data: {
        labels: {
          connect: labelIds.map((id) => ({ id })),
        },
      },
    });
  }
}
