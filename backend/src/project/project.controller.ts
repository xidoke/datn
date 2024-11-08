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

@Controller("workspaces/:workspaceId/projects")
@UseGuards(CognitoAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(
    @Param("workspaceId") workspaceId: string,
    @Req() req: RequestWithUser,
    @Body() createProjectDto: { name: string; description?: string },
  ) {
    return this.projectService.createProject(
      workspaceId,
      req.user.userId,
      createProjectDto,
    );
  }

  @Get()
  findAll(
    @Param("workspaceId") workspaceId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.projectService.getProjects(workspaceId, req.user.userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Req() req: RequestWithUser) {
    return this.projectService.getProject(id, req.user.userId);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Req() req: RequestWithUser,
    @Body() updateProjectDto: { name?: string; description?: string },
  ) {
    return this.projectService.updateProject(
      id,
      req.user.userId,
      updateProjectDto,
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: RequestWithUser) {
    return this.projectService.deleteProject(id, req.user.userId);
  }
}
