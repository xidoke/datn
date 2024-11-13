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
  HttpException,
  HttpStatus,
  ConflictException,
} from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";
import { RequestWithUser } from "src/user/interfaces/request.interface";
import { UserService } from "src/user/user.service";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";

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
  @UseGuards(CognitoAuthGuard)
  async getUserWorkspaces(
    @Req() req: RequestWithUser,
    @Query("owner") isOwner: string,
  ) {
    return this.workspaceService.getUserWorkspaces(req.user.userId, {
      isOwner: isOwner === "true",
    });
  }

  @Post()
  @UseGuards(CognitoAuthGuard)
  async createWorkspace(
    @Req() req: RequestWithUser,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    try {
      const workspaceCreated = await this.workspaceService.createWorkspace({
        name: createWorkspaceDto.name,
        userId: req.user.userId,
        slug: createWorkspaceDto.slug,
      });
      // edit lastWorkspaceSlug in user
      await this.userService.update(req.user.userId, {
        lastWorkspaceSlug: createWorkspaceDto.slug,
      });
      return workspaceCreated;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  // Chỉ cho phép thành viên trong workspace mới có thể xem thông tin workspace
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
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.updateWorkspace(
      slug,
      req.user.userId,
      updateWorkspaceDto,
    );
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
