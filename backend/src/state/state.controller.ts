import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";
import { WorkspacePermissionGuard } from "src/permission/workspace-permission.guard";
import { StateService } from "./state.service";
import { CreateStateDto } from "./dto/create-state.dto";
import { UpdateStateDto } from "./dto/update-state.dto";
import { WorkspacePermission } from "src/permission/permission.type";
import { Permissions } from "src/permission/permission.decorator";

@Controller("workspaces/:workspaceSlug/projects/:projectId/states")
@UseGuards(CognitoAuthGuard, WorkspacePermissionGuard)
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  @Permissions(WorkspacePermission.VIEW_PROJECT)
  async getStates(@Param("projectId") projectId: string) {
    return this.stateService.getStates(projectId);
  }

  @Get(":stateId")
  @Permissions(WorkspacePermission.VIEW_PROJECT)
  async getState(
    @Param("projectId") projectId: string,
    @Param("stateId") stateId: string,
  ) {
    return this.stateService.getState(projectId, stateId);
  }

  @Post()
  @Permissions(WorkspacePermission.MANAGE_PROJECT_SETTINGS)
  async createState(
    @Param("projectId") projectId: string,
    @Body() createStateDto: CreateStateDto,
  ) {
    return this.stateService.createState(projectId, createStateDto);
  }

  @Patch(":stateId")
  @Permissions(WorkspacePermission.MANAGE_PROJECT_SETTINGS)
  async updateState(
    @Param("projectId") projectId: string,
    @Param("stateId") stateId: string,
    @Body() updateStateDto: UpdateStateDto,
  ) {
    return this.stateService.updateState(projectId, stateId, updateStateDto);
  }

  @Delete(":stateId")
  @Permissions(WorkspacePermission.MANAGE_PROJECT_SETTINGS)
  async deleteState(
    @Param("projectId") projectId: string,
    @Param("stateId") stateId: string,
  ) {
    return this.stateService.deleteState(projectId, stateId);
  }

  @Patch(":stateId/set-default")
  @Permissions(WorkspacePermission.MANAGE_PROJECT_SETTINGS)
  async setDefaultState(
    @Param("projectId") projectId: string,
    @Param("stateId") stateId: string,
  ) {
    return this.stateService.setDefaultState(projectId, stateId);
  }
}
