import { Module } from "@nestjs/common";
import { WorkspaceInvitationsService } from "./workspace-invitations.service";
import { WorkspaceInvitationsController } from "./workspace-invitations.controller";

@Module({
  providers: [WorkspaceInvitationsService],
  controllers: [WorkspaceInvitationsController],
})
export class WorkspaceInvitationsModule {}
