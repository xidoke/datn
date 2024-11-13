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
} from "@nestjs/common";
import { IssuesService } from "./issue.service";
import { CreateIssueDto } from "./dto/create-issue.dto";
import { UpdateIssueDto } from "./dto/update-issue.dto";
import { CognitoAuthGuard } from "../auth/guards/cognito.guard";
import { RequestWithUser } from "src/user/interfaces/request.interface";

@Controller("workspaces/:workspaceSlug/projects/:projectId/issues")
@UseGuards(CognitoAuthGuard)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  create(
    @Body() createIssueDto: CreateIssueDto,
    @Req() req: RequestWithUser,
    @Param("projectId") projectId: string,
  ) {
    return this.issuesService.create(
      { ...createIssueDto, projectId },
      req.user.userId,
    );
  }

  @Get()
  findAll(@Param("projectId") projectId: string) {
    return this.issuesService.findAll(projectId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.issuesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateIssueDto: UpdateIssueDto) {
    return this.issuesService.update(id, updateIssueDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.issuesService.remove(id);
  }

  @Get("list")
  async getIssues(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("projectId") projectId: string,
    @Query("issues") issueIds: string,
    @Query("order_by") orderBy: string = "createdAt",
    @Query("group_by") groupBy: string,
    @Query("sub_group_by") subGroupBy: string,
    @Req() req: RequestWithUser,
  ) {
    if (!issueIds) {
      throw new BadRequestException("Issues are required");
    }

    // Split the issue IDs from the string
    const issueIdList = issueIds.split(",").filter((id) => id !== "");

    try {
      const issues = await this.issuesService.getIssuesList({
        workspaceSlug,
        projectId,
        issueIds: issueIdList,
        orderBy,
        groupBy,
        subGroupBy,
        filters: req.query,
        userId: req.user.userId,
      });

      //  You might want to implement a method to update recent visited task
      // await this.issuesService.updateRecentVisitedTask(workspaceSlug, projectId, req.user.userId);

      return issues;
    } catch (error) {
      // Handle specific errors if needed
      throw new BadRequestException(error.message);
    }
  }
}
