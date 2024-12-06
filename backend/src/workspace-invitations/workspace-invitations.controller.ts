import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Body,
  Query,
  Delete,
} from "@nestjs/common";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";
import { WorkspaceInvitationsService } from "./workspace-invitations.service";
import { InviteWorkspaceDto } from "./dto/invite-workspace.dto";
import { WorkspacePermissionGuard } from "src/permission/workspace-permission.guard";
import { WorkspacePermission } from "src/permission/permission.type";
import { PaginationQueryDto } from "src/user/dto/pagination-query.dto";
import { Permissions } from "src/permission/permission.decorator";

@Controller("workspaces/:slug/invitations")
@UseGuards(CognitoAuthGuard, WorkspacePermissionGuard)
export class WorkspaceInvitationsController {
  constructor(
    private workspaceInvitationService: WorkspaceInvitationsService,
  ) {}
  // invitations
  @Get()
  @Permissions(WorkspacePermission.VIEW_INVITATIONS)
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
  @Permissions(WorkspacePermission.INVITE_MEMBER)
  async createInvitation(
    @Param("slug") slug: string,
    @Body() inviteWorkspaceDto: InviteWorkspaceDto,
  ) {
    return this.workspaceInvitationService.createInvitation(
      slug,
      inviteWorkspaceDto,
    );
  }

  @Get(":id")
  @Permissions(WorkspacePermission.VIEW_INVITATIONS)
  async getInvitation(@Param("id") id: string) {
    return this.workspaceInvitationService.getInvitation(id);
  }

  // Cancel invitation
  @Delete(":invitationId")
  @Permissions(WorkspacePermission.CANCEL_INVITATION)
  async cancelInvitation(
    @Param("slug") slug: string,
    @Param("invitationId") invitationId: string,
  ) {
    return this.workspaceInvitationService.cancelInvitation(slug, invitationId);
  }
}
