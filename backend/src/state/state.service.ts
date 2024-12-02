import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { UpdateStateDto } from "./dto/update-state.dto";
import { CreateStateDto } from "./dto/create-state.dto";

@Injectable()
export class StateService {
  constructor(private prisma: PrismaService) {}

  async getStates(projectId: string) {
    return this.prisma.state.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });
  }

  async getState(projectId: string, stateId: string) {
    const state = await this.prisma.state.findFirst({
      where: { id: stateId, projectId },
    });

    if (!state) {
      throw new NotFoundException(
        `State with ID ${stateId} not found in project ${projectId}`,
      );
    }

    return state;
  }

  async setDefaultState(projectId: string, stateId: string) {
    return this.prisma.$transaction(async (prisma) => {
      // First, unset the current default state if it exists
      await prisma.state.updateMany({
        where: { projectId, isDefault: true },
        data: { isDefault: false },
      });

      // Then, set the new default state
      const updatedState = await prisma.state.update({
        where: { id: stateId, projectId },
        data: { isDefault: true },
      });

      if (!updatedState) {
        throw new NotFoundException(
          `State with ID ${stateId} not found in project ${projectId}`,
        );
      }

      return updatedState;
    });
  }

  async createState(projectId: string, createStateDto: CreateStateDto) {
    try {
      return await this.prisma.state.create({
        data: {
          ...createStateDto,
          project: { connect: { id: projectId } },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(
            "A state with this name already exists in the project",
          );
        }
      }
      throw error;
    }
  }

  async updateState(
    projectId: string,
    stateId: string,
    updateStateDto: UpdateStateDto,
  ) {
    try {
      return await this.prisma.state.update({
        where: { id: stateId, projectId },
        data: updateStateDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(
            "A state with this name already exists in the project",
          );
        }
      }
      throw error;
    }
  }

  async deleteState(projectId: string, stateId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const state = await prisma.state.findUnique({
        where: { id: stateId, projectId },
        include: { issues: { select: { id: true }, take: 1 } },
      });

      if (!state) {
        throw new NotFoundException("State not found");
      }

      if (state.isDefault) {
        throw new ConflictException("Cannot delete the default state");
      }

      if (state.issues.length > 0) {
        throw new ConflictException(
          "Cannot delete a state that has associated issues",
        );
      }

      const statesCount = await prisma.state.count({
        where: { projectId, group: state.group },
      });

      if (statesCount <= 1) {
        throw new ConflictException("Cannot delete the last state in a group");
      }

      return prisma.state.delete({
        where: { id: state.id },
      });
    });
  }
}
