import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class StateService {
  constructor(private prisma: PrismaService) {}

  async getAllStates(workspaceSlug: string, projectId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    });

    if (!workspace) {
      throw new NotFoundException(
        `Workspace with slug ${workspaceSlug} not found`,
      );
    }

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.workspaceId !== workspace.id) {
      throw new NotFoundException(
        `Project with id ${projectId} not found in workspace ${workspaceSlug}`,
      );
    }

    //  TODO: tạm thời sắp xếp theo tên
    const states = await this.prisma.state.findMany({
      where: { projectId: projectId },
      orderBy: { order: "asc" },
    });

    return states;
  }
}
