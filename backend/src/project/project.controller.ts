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

@Controller("workspaces/:workspaceSlug/projects")
@UseGuards(CognitoAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(
    @Param("workspaceSlug") workspaceSlug: string,
    @Req() req: RequestWithUser,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    try {
      return this.projectService.createProject(
        createProjectDto,
        workspaceSlug,
        req.user.userId,
      );
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    }
  }

  @Get()
  findAll(
    @Param("workspaceSlug") workspaceSlug: string,
    @Req() req: RequestWithUser,
  ) {
    return this.projectService.getProjects(workspaceSlug, req.user.userId);
  }

  @Get(":id")
  findOne(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("id") id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.projectService.getProject(workspaceSlug, id, req.user.userId);
  }

  @Patch(":id")
  update(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("id") id: string,
    @Req() req: RequestWithUser,
    @Body() updateProjectDto: { name?: string; description?: string },
  ) {
    return this.projectService.updateProject(
      workspaceSlug,
      id,
      req.user.userId,
      updateProjectDto,
    );
  }

  @Delete(":id")
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
