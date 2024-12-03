import { Injectable } from "@nestjs/common";
import { CreateCycleDto } from "./dto/create-cycle.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CycleService {
  constructor(private readonly prisma: PrismaService) {}

  async getCycles(
    workspaceSlug: string,
    projectId: string,
    cycleType?: string,
  ) {}

  async createCycle(
    workspaceSlug: string,
    projectId: string,
    createCycleDto: CreateCycleDto,
  ) {
    const { title, description, startDate, dueDate } = createCycleDto;
    return this.prisma.cycle.create({
      data: {
        title,
        description,
        startDate,
        dueDate,
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
  }

  async updateCycle(
    workspaceSlug: string,
    projectId: string,
    cycleId: string,
    updateData: any,
  ) {
    // Update cycle
  }

  async deleteCycle(workspaceSlug: string, projectId: string, cycleId: string) {
    // Delete cycle
  }

  async cycleDateCheck(
    workspaceSlug: string,
    projectId: string,
    dateCheckData: any,
  ) {
    // Check cycle date
  }
}
