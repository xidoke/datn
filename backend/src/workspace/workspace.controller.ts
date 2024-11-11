import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  Post,
  Param,
  Delete,
  Body,
  Patch,
} from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";
import { RequestWithUser } from "src/user/interfaces/request.interface";
import { UserService } from "src/user/user.service";

@Controller("workspaces")
export class WorkspaceController {
  constructor(
    private workspaceService: WorkspaceService,
    private userService: UserService,
  ) {}

  @Get("check-workspace-slug")
  async checkWorkspaceAvailability(@Query("slug") slug: string) {
    return this.workspaceService.checkWorkspaceAvailability(slug);
  }

  @Get()
  @UseGuards(CognitoAuthGuard)
  async getUserWorkspaces(@Req() req: RequestWithUser) {
    return this.workspaceService.getUserWorkspaces(req.user.userId);
  }

  @Post()
  @UseGuards(CognitoAuthGuard)
  async createWorkspace(
    @Req() req: RequestWithUser,
    @Body() data: { name: string; slug: string },
  ) {
    try {
      const workspaceCreated = await this.workspaceService.createWorkspace({
        name: data.name,
        userId: req.user.userId,
        slug: data.slug,
      });
      // edit lastWorkspaceSlug in user
      await this.userService.update(req.user.userId, {
        lastWorkspaceSlug: data.slug,
      });
      return workspaceCreated;
    } catch (error) {
      // TODO: Handle error
      throw new Error(error);
    }
  }

  @Get(":slug")
  @UseGuards(CognitoAuthGuard)
  async getWorkspaceBySlug(
    @Param("slug") slug: string,
    @Req() req: RequestWithUser,
  ) {
    return this.workspaceService.getWorkspace(slug, req.user.userId);
  }

  // TODO: Hiện tại chỉ cho phép sửa name
  @Patch(":slug")
  @UseGuards(CognitoAuthGuard)
  async updateWorkspace(
    @Param("slug") slug: string,
    @Req() req: RequestWithUser,
    @Body() data: { name?: string },
  ) {
    return this.workspaceService.updateWorkspace(slug, req.user.userId, data);
  }

  @Delete(":slug")
  @UseGuards(CognitoAuthGuard)
  async deleteWorkspace(
    @Param("slug") slug: string,
    @Req() req: RequestWithUser,
  ) {
    return this.workspaceService.deleteWorkspace(req.user.userId, slug);
  }
}
