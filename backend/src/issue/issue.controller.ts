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
  Query,
  BadRequestException,
  DefaultValuePipe,
  ParseIntPipe,
} from "@nestjs/common";
import { IssuesService } from "./issue.service";
import { CreateIssueDto } from "./dto/create-issue.dto";
import { UpdateIssueDto } from "./dto/update-issue.dto";
import { CognitoAuthGuard } from "../auth/guards/cognito.guard";
import { RequestWithUser } from "src/user/interfaces/request.interface";
import { WorkspacePermissionGuard } from "src/permission/workspace-permission.guard";
import { WorkspacePermission } from "src/permission/permission.type";
import { Permissions } from "src/permission/permission.decorator";
import { ResponseMessage } from "src/common/decorator/response-message.decorator";

@Controller("workspaces/:workspaceSlug/projects/:projectId/issues")
@UseGuards(CognitoAuthGuard, WorkspacePermissionGuard)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  @Permissions(WorkspacePermission.CREATE_ISSUE)
  @ResponseMessage("Issue created successfully")
  async create(
    @Body() createIssueDto: CreateIssueDto,
    @Req() req: RequestWithUser,
    @Param("projectId") projectId: string,
    @Param("workspaceSlug") workspaceSlug: string,
  ) {
    try {
      return await this.issuesService.create(
        createIssueDto,
        projectId,
        req.user.userId,
        workspaceSlug,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @Permissions(WorkspacePermission.VIEW_ISSUE)
  @ResponseMessage("Issues retrieved successfully")
  async findAll(
    @Param("projectId") projectId: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("pageSize", new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query("sortBy", new DefaultValuePipe("createdAt")) sortBy: string,
    @Query("sortOrder", new DefaultValuePipe("desc")) sortOrder: "asc" | "desc",
  ) {
    return this.issuesService.findAll(
      projectId,
      page,
      pageSize,
      sortBy,
      sortOrder,
    );
  }

  @Get(":id")
  @Permissions(WorkspacePermission.VIEW_ISSUE)
  @ResponseMessage("Issue retrieved successfully")
  async findOne(@Param("id") id: string) {
    return this.issuesService.findOne(id);
  }

  @Patch(":id")
  @Permissions(WorkspacePermission.UPDATE_ISSUE)
  @ResponseMessage("Issue updated successfully")
  async update(
    @Param("id") id: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ) {
    return this.issuesService.update(id, updateIssueDto);
  }

  @Delete(":id")
  @Permissions(WorkspacePermission.DELETE_ISSUE)
  @ResponseMessage("Issue deleted successfully")
  async remove(@Param("id") id: string) {
    return this.issuesService.remove(id);
  }

  // @Get("list")
  // @Permissions(WorkspacePermission.VIEW_ISSUE)
  // @ResponseMessage("Issues list retrieved successfully")
  // async getIssues(
  //   @Param("workspaceSlug") workspaceSlug: string,
  //   @Param("projectId") projectId: string,
  //   @Query("issues") issueIds: string,
  //   @Query("order_by") orderBy: string = "createdAt",
  //   @Query("group_by") groupBy: string,
  //   @Query("sub_group_by") subGroupBy: string,
  //   @Req() req: RequestWithUser,
  // ) {
  //   if (!issueIds) {
  //     throw new BadRequestException("Issues are required");
  //   }

  //   const issueIdList = issueIds.split(",").filter((id) => id !== "");

  //   try {
  //     const issues = await this.issuesService.getIssuesList({
  //       projectId,
  //       issueIds: issueIdList,
  //       orderBy,
  //       groupBy,
  //       subGroupBy,
  //       filters: req.query,
  //     });

  //     await this.issuesService.updateRecentVisitedTask(
  //       workspaceSlug,
  //       projectId,
  //       req.user.userId,
  //     );

  //     return issues;
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
