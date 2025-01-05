import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CognitoAuthGuard } from "../auth/guards/cognito.guard";
import { CreateProjectDto } from "./dto/create-project.dto";
import { WorkspacePermissionGuard } from "src/permission/workspace-permission.guard";
import { WorkspacePermission } from "src/permission/permission.type";
import { Permissions } from "src/permission/permission.decorator";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Controller("workspaces/:workspaceSlug/projects")
@UseGuards(CognitoAuthGuard, WorkspacePermissionGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Permissions(WorkspacePermission.CREATE_PROJECT)
  create(
    @Param("workspaceSlug") workspaceSlug: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectService.createProject(workspaceSlug, createProjectDto);
  }

  @Get()
  @Permissions(WorkspacePermission.VIEW_PROJECT)
  findAll(@Param("workspaceSlug") workspaceSlug: string) {
    return this.projectService.getProjects(workspaceSlug);
  }

  @Get(":id")
  @Permissions(WorkspacePermission.VIEW_PROJECT)
  findOne(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("id") id: string,
  ) {
    return this.projectService.getProject(workspaceSlug, id);
  }

  @Patch(":id")
  @Permissions(WorkspacePermission.UPDATE_PROJECT)
  update(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("id") id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(
      workspaceSlug,
      id,
      updateProjectDto,
    );
  }

  @Delete(":id")
  @Permissions(WorkspacePermission.DELETE_PROJECT)
  remove(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("id") id: string,
  ) {
    return this.projectService.deleteProject(id);
  }
}
