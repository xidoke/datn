import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Body,
  SetMetadata,
  Query,
} from "@nestjs/common";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";
import { WorkspaceInvitationsService } from "./workspace-invitations.service";
import { InviteWorkspaceDto } from "./dto/invite-workspace.dto";
import { WorkspacePermissionGuard } from "src/permission/workspace-permission.guard";
import { WorkspacePermission } from "src/permission/permission.type";
import { PaginationQueryDto } from "src/user/dto/pagination-query.dto";

@Controller("workspaces/:slug/invitations")
@UseGuards(CognitoAuthGuard, WorkspacePermissionGuard)
export class WorkspaceInvitationsController {
  constructor(
    private workspaceInvitationService: WorkspaceInvitationsService,
  ) {}
  // invitations
  @Get()
  @SetMetadata("workspace_permission", WorkspacePermission.INVITE_MEMBER)
  async getInvitations(
    @Param("slug") slug: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.workspaceInvitationService.getInvitations(
      slug,
      paginationQueryDto,
    );
  }

  @Post()
  @SetMetadata("workspace_permission", WorkspacePermission.INVITE_MEMBER)
  async createInvitation(
    @Param("slug") slug: string,
    @Body() inviteWorkspaceDto: InviteWorkspaceDto,
  ) {
    return this.workspaceInvitationService.createInvitation(
      slug,
      inviteWorkspaceDto,
    );
  }
}
