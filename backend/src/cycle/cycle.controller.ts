import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CycleService } from "./cycle.service";
import { WorkspacePermissionGuard } from "src/permission/workspace-permission.guard";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";
import { areDatesValid, CreateCycleDto } from "./dto/create-cycle.dto";

@Controller("workspaces/:workspaceSlug/projects/:projectId/cycles")
@UseGuards(CognitoAuthGuard, WorkspacePermissionGuard)
export class CycleController {
  constructor(private readonly cycleService: CycleService) {}

  @Get()
  async getCycles(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("projectId") projectId: string,
  ) {
    return this.cycleService.getCycles(workspaceSlug, projectId);
  }

  @Post()
  async createCycle(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("projectId") projectId: string,
    @Body() createCycleDto: CreateCycleDto,
  ) {
    if (!areDatesValid(createCycleDto.startDate, createCycleDto.dueDate)) {
      throw new BadRequestException(
        "Both start and end dates must be provided or both must be undefined",
      );
    }
    return this.cycleService.createCycle(
      workspaceSlug,
      projectId,
      createCycleDto,
    );
  }

  @Patch("/:cycleId")
  async updateCycle(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("projectId") projectId: string,
    @Param("cycleId") cycleId: string,
    @Body() updateData: any,
  ) {
    return this.cycleService.updateCycle(
      workspaceSlug,
      projectId,
      cycleId,
      updateData,
    );
  }

  @Delete("/:cycleId")
  async deleteCycle(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("projectId") projectId: string,
    @Param("cycleId") cycleId: string,
  ) {
    return this.cycleService.deleteCycle(workspaceSlug, projectId, cycleId);
  }

  @Post("/date-check")
  async cycleDateCheck(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("projectId") projectId: string,
    @Body() dateCheckData: any,
  ) {
    return this.cycleService.cycleDateCheck(
      workspaceSlug,
      projectId,
      dateCheckData,
    );
  }
}
