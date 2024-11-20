import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Body,
  Delete,
} from "@nestjs/common";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";
import { WorkspaceInvitationsService } from "./workspace-invitations.service";
import { InviteWorkspaceDto } from "./dto/invite-workspace.dto";

@Controller("workspaces/:slug/invitations")
export class WorkspaceInvitationsController {
  constructor(
    private workspaceInvitationService: WorkspaceInvitationsService,
  ) {}
  // invitations
  @Get()
  @UseGuards(CognitoAuthGuard)
  async getInvitations(@Param("slug") slug: string) {
    return this.workspaceInvitationService.getInvitations(slug);
  }

  @Post("")
  async createInvitation(
    @Param("slug") slug: string,
    @Body() inviteWorkspaceDto: InviteWorkspaceDto,
  ) {
    const { email, role } = inviteWorkspaceDto;
    return this.workspaceInvitationService.createInvitation(email, slug, role);
  }

  @Delete(":slug/invitations/:email")
  async deleteInvitation(
    @Param("slug") slug: string,
    @Param("email") email: string,
  ) {
    return this.workspaceInvitationService.deleteInvitation(email, slug);
  }
}
