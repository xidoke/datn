import { Injectable } from "@nestjs/common";
import { CreateCycleDto } from "./dto/create-cycle.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateCycleDto } from "./dto/update-cycle.dto";

@Injectable()
export class CycleService {
  constructor(private readonly prisma: PrismaService) {}

  async getCycles(
    workspaceSlug: string,
    projectId: string,
    cycleType?: string,
  ) {
    return this.prisma.cycle.findMany({
      where: {
        projectId,
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });
  }

  async createCycle(
    workspaceSlug: string,
    projectId: string,
    createCycleDto: CreateCycleDto,
    userId: string,
  ) {
    const { title, description, startDate, dueDate } = createCycleDto;
    // we must check no cycle has intersected date
    if (startDate && dueDate) {
      const overlappingCycles = await this.prisma.cycle.findMany({
        where: {
          projectId,
          AND: [
            {
              startDate: {
                lte: dueDate,
              },
            },
            {
              dueDate: {
                gte: startDate,
              },
            },
          ],
        },
      });

      if (overlappingCycles.length > 0) {
        throw new Error("Cycle dates overlap with an existing cycle.");
      }
    }

    return this.prisma.cycle.create({
      data: {
        title,
        description,
        startDate,
        dueDate,
        creator: {
          connect: {
            id: userId,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async updateCycle(
    workspaceSlug: string,
    projectId: string,
    cycleId: string,
    updateData: UpdateCycleDto,
  ) {
    const { startDate, dueDate } = updateData;
    // we must check no cycle has intersected date
    if ((startDate && !dueDate) || (!startDate && dueDate)) {
      throw new Error(
        "Both start date and due date must be defined or undefined.",
      );
    }

    if (startDate && dueDate) {
      const overlappingCycles = await this.prisma.cycle.findMany({
        where: {
          projectId,
          id: {
            not: cycleId,
          },
          AND: [
            {
              startDate: {
                lte: dueDate,
              },
            },
            {
              dueDate: {
                gte: startDate,
              },
            },
          ],
        },
      });

      if (overlappingCycles.length > 0) {
        throw new Error("Cycle dates overlap with an existing cycle.");
      }
    }

    return this.prisma.cycle.update({
      where: {
        id: cycleId,
      },
      data: {
        ...updateData,
        startDate: startDate || null,
        dueDate: dueDate || null,
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async deleteCycle(workspaceSlug: string, projectId: string, cycleId: string) {
    return this.prisma.cycle.delete({
      where: {
        id: cycleId,
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async getCycleProgress(
    workspaceSlug: string,
    projectId: string,
    cycleId: string,
  ) {
    // progress calculation
    const totalIssues = await this.prisma.issue.count({
      where: {
        cycleId,
        projectId,
        state: {
          group: {
            not: "cancelled",
          },
        },
      },
    });

    const incompleteIssues = await this.prisma.issue.count({
      where: {
        cycleId,
        projectId,
        state: {
          group: {
            notIn: ["completed", "cancelled"],
          },
        },
      },
    });

    const unProgress =
      totalIssues > 0 ? Math.floor((incompleteIssues / totalIssues) * 100) : 0;

    return {
      totalIssues,
      incompleteIssues,
      progress: 100 - unProgress,
    };
  }

  async cycleDateCheck(
    workspaceSlug: string,
    projectId: string,
    dateCheckData: any,
  ) {
    // Check cycle date
  }
}
