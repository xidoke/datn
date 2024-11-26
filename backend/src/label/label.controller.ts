import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from "@nestjs/common";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";
import { WorkspacePermissionGuard } from "src/permission/workspace-permission.guard";
import { LabelService } from "./label.service";
import { CreateLabelDto } from "./dto/create-label.dto";
import { UpdateLabelDto } from "./dto/update-label.dto";
import { BulkCreateLabelDto } from "./dto/bulk-create-label.dto";
import { BulkUpdateLabelDto } from "./dto/bulk-update-label.dto";
import { WorkspacePermission } from "src/permission/permission.type";
import { Permissions } from "src/permission/permission.decorator";

@Controller("workspaces/:workspaceSlug/projects/:projectId/labels")
@UseGuards(CognitoAuthGuard, WorkspacePermissionGuard)
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Get()
  @Permissions(WorkspacePermission.VIEW_LABEL)
  async getLabels(@Param("projectId") projectId: string) {
    return this.labelService.getLabels(projectId);
  }

  @Get(":labelId")
  @Permissions(WorkspacePermission.VIEW_LABEL)
  async getLabel(
    @Param("projectId") projectId: string,
    @Param("labelId") labelId: string,
  ) {
    return this.labelService.getLabel(projectId, labelId);
  }

  @Post()
  @Permissions(WorkspacePermission.CREATE_LABEL)
  async createLabel(
    @Param("projectId") projectId: string,
    @Body() createLabelDto: CreateLabelDto,
  ) {
    return this.labelService.createLabel(projectId, createLabelDto);
  }

  @Patch(":labelId")
  @Permissions(WorkspacePermission.UPDATE_LABEL)
  async updateLabel(
    @Param("projectId") projectId: string,
    @Param("labelId") labelId: string,
    @Body() updateLabelDto: UpdateLabelDto,
  ) {
    return this.labelService.updateLabel(projectId, labelId, updateLabelDto);
  }

  @Delete(":labelId")
  @Permissions(WorkspacePermission.DELETE_LABEL)
  async deleteLabel(
    @Param("projectId") projectId: string,
    @Param("labelId") labelId: string,
  ) {
    return this.labelService.deleteLabel(projectId, labelId);
  }

  @Post("bulk")
  @Permissions(WorkspacePermission.CREATE_LABEL)
  async createLabels(
    @Param("projectId") projectId: string,
    @Body() bulkCreateLabelDto: BulkCreateLabelDto,
  ) {
    return this.labelService.createLabels(projectId, bulkCreateLabelDto.labels);
  }

  @Patch("bulk")
  @Permissions(WorkspacePermission.UPDATE_LABEL)
  async updateLabels(
    @Param("projectId") projectId: string,
    @Body() bulkUpdateLabelDto: BulkUpdateLabelDto,
  ) {
    return this.labelService.updateLabels(projectId, bulkUpdateLabelDto.labels);
  }

  @Delete("bulk")
  @Permissions(WorkspacePermission.DELETE_LABEL)
  async deleteLabels(
    @Param("projectId") projectId: string,
    @Query("ids") labelIds: string,
  ) {
    const ids = labelIds.split(",");
    return this.labelService.deleteLabels(projectId, ids);
  }

  @Get("issues/:issueId")
  @Permissions(WorkspacePermission.VIEW_LABEL)
  async getIssueLabels(
    @Param("projectId") projectId: string,
    @Param("issueId") issueId: string,
  ) {
    return this.labelService.getIssueLabels(projectId, issueId);
  }

  @Post("issues/:issueId")
  @Permissions(WorkspacePermission.UPDATE_ISSUE)
  async addIssueLabel(
    @Param("projectId") projectId: string,
    @Param("issueId") issueId: string,
    @Body("labelId") labelId: string,
  ) {
    return this.labelService.addIssueLabel(projectId, issueId, labelId);
  }

  @Delete("issues/:issueId/:labelId")
  @Permissions(WorkspacePermission.UPDATE_ISSUE)
  async deleteIssueLabel(
    @Param("projectId") projectId: string,
    @Param("issueId") issueId: string,
    @Param("labelId") labelId: string,
  ) {
    return this.labelService.deleteIssueLabel(projectId, issueId, labelId);
  }

  @Post("issues/:issueId/bulk")
  @Permissions(WorkspacePermission.UPDATE_ISSUE)
  async addIssueLabels(
    @Param("projectId") projectId: string,
    @Param("issueId") issueId: string,
    @Body("labelIds") labelIds: string[],
  ) {
    return this.labelService.addIssueLabels(projectId, issueId, labelIds);
  }
}
