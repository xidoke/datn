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
  SetMetadata,
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
    @Query("owner") isOwner: string,
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

  // Chỉ cho phép thành viên trong workspace mới có thể xem thông tin workspace
  @Get(":slug")
  async getWorkspaceBySlug(
    @Param("slug") slug: string,
    @Req() req: RequestWithUser,
  ) {
    return this.workspaceService.getWorkspace(slug, req.user.userId);
  }

  // TODO: Hiện tại chỉ cho phép sửa name
  @Patch(":slug")
  @SetMetadata("workspace_permission", WorkspacePermission.UPDATE_WORKSPACE)
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
  @SetMetadata("workspace_permission", WorkspacePermission.DELETE_WORKSPACE)
  async deleteWorkspace(
    @Param("slug") slug: string,
    @Req() req: RequestWithUser,
  ) {
    return this.workspaceService.deleteWorkspace(req.user.userId, slug);
  }

  @Patch(":slug/logo")
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
  ) {
    return this.workspaceService.updateWorkspaceLogo(slug, logo);
  }
}
