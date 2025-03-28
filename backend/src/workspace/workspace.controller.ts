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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";
import { RequestWithUser } from "src/user/interfaces/request.interface";
import { UserService } from "src/user/user.service";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { WorkspacePermissionGuard } from "src/permission/workspace-permission.guard";
import { WorkspacePermission } from "src/permission/permission.type";
import { Permissions } from "src/permission/permission.decorator";

@UseGuards(CognitoAuthGuard, WorkspacePermissionGuard)
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

  // Trả về tất cả các workspace mà user đã tham gia
  // query isOwner = true để lấy workspace mà user là owner
  @Get()
  async getUserWorkspaces(
    @Req() req: RequestWithUser,
    @Query("isOwner") isOwner: string,
  ) {
    return this.workspaceService.getUserWorkspaces(req.user.userId, {
      isOwner: isOwner === "true",
    });
  }

  @Post()
  async createWorkspace(
    @Req() req: RequestWithUser,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    const workspaceCreated = await this.workspaceService.createWorkspace(
      createWorkspaceDto,
      req.user.userId,
    );
    // edit lastWorkspaceSlug in user
    await this.userService.update(req.user.userId, {
      lastWorkspaceSlug: createWorkspaceDto.slug,
    });
    return workspaceCreated;
  }

  @Permissions(WorkspacePermission.VIEW_WORKSPACE)
  @Get(":slug")
  async getWorkspaceBySlug(
    @Param("slug") slug: string,
    @Req() req: RequestWithUser,
  ) {
    // lấy user id để trả permission về
    return this.workspaceService.getWorkspace(slug, req.user.userId);
  }

  @Patch(":slug")
  @Permissions(WorkspacePermission.UPDATE_WORKSPACE)
  async updateWorkspace(
    @Param("slug") slug: string,
    @Req() req: RequestWithUser,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.updateWorkspace(
      slug,
      req.user.userId,
      updateWorkspaceDto,
    );
  }

  @Delete(":slug")
  @Permissions(WorkspacePermission.DELETE_WORKSPACE)
  async deleteWorkspace(@Param("slug") slug: string) {
    return this.workspaceService.deleteWorkspace(slug);
  }

  @Patch(":slug/logo")
  @Permissions(WorkspacePermission.UPDATE_WORKSPACE)
  @UseInterceptors(FileInterceptor("logo"))
  async updateWorkspaceLogo(
    @Param("slug") slug: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB limit
        ],
      }),
    )
    logo: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    return this.workspaceService.updateWorkspaceLogo(
      req.user.userId,
      slug,
      logo,
    );
  }

  @Get(":slug/dashboard")
  @Permissions(WorkspacePermission.VIEW_WORKSPACE)
  async getWorkspaceDashboard(
    @Param("slug") slug: string,
    @Req() req: RequestWithUser,
  ) {
    return this.workspaceService.getWorkspaceDashboard(slug, req.user.userId);
  }

  @Get(":slug/dashboard/:userId")
  @Permissions(WorkspacePermission.VIEW_WORKSPACE)
  async getWorkspaceMemberDashboard(
    @Param("slug") slug: string,
    @Param("userId") userId: string,
  ) {
    return this.workspaceService.getWorkspaceDashboard(slug, userId);
  }

  @Post(":slug/leave")
  async leaveWorkspace(
    @Param("slug") slug: string,
    @Req() req: RequestWithUser,
  ) {
    return this.workspaceService.leaveWorkspace(slug, req.user.userId);
  }
}
