import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CognitoAuthGuard } from "../auth/guards/cognito.guard";
import { RequestWithUser } from "../user/interfaces/request.interface";
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
    @Req() req: RequestWithUser,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    try {
      return this.projectService.createProject(workspaceSlug, createProjectDto);
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    }
  }

  @Get()
  @Permissions(WorkspacePermission.VIEW_PROJECT)
  findAll(
    @Param("workspaceSlug") workspaceSlug: string,
    @Req() req: RequestWithUser,
  ) {
    return this.projectService.getProjects(workspaceSlug, req.user.userId);
  }

  @Get(":id")
  @Permissions(WorkspacePermission.VIEW_PROJECT)
  findOne(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("id") id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.projectService.getProject(workspaceSlug, id, req.user.userId);
  }

  @Patch(":id")
  @Permissions(WorkspacePermission.UPDATE_PROJECT)
  update(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("id") id: string,
    @Req() req: RequestWithUser,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(
      workspaceSlug,
      id,
      req.user.userId,
      updateProjectDto,
    );
  }

  @Delete(":id")
  @Permissions(WorkspacePermission.DELETE_PROJECT)
  remove(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("id") id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.projectService.deleteProject(
      workspaceSlug,
      id,
      req.user.userId,
    );
  }
}
