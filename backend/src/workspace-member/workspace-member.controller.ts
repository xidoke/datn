import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";
import { WorkspaceMemberService } from "./workspace-member.service";
import { RequestWithUser } from "src/user/interfaces/request.interface";
import { UpdateMemberRoleDto } from "./dto/update-member-role.dto";
import { PaginationQueryDto } from "src/user/dto/pagination-query.dto";
import { WorkspaceRole } from "@prisma/client";
import { WorkspacePermissionGuard } from "src/permission/workspace-permission.guard";
import { WorkspacePermission } from "src/permission/permission.type";
import { Permissions } from "src/permission/permission.decorator";

@Controller("workspaces/:workspaceSlug/members")
@UseGuards(CognitoAuthGuard, WorkspacePermissionGuard)
export class WorkspaceMemberController {
  constructor(private workspaceMembersService: WorkspaceMemberService) {}

  @Get()
  async getWorkspaceMembers(
    @Param("workspaceSlug") workspaceSlug: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.workspaceMembersService.getWorkspaceMembers(
      workspaceSlug,
      paginationQuery,
    );
  }

  // ! Hiện tại không hỗ trợ thêm thành viên mà không thông qua invitation
  // ! Nếu cần hỗ trợ chức năng này, cần thêm permission vào permission service
  @Post()
  @Permissions(WorkspacePermission.ADD_MEMBER)
  async addMemberToWorkspace(
    @Param("workspaceSlug") workspaceSlug: string,
    @Body("email") email: string,
    @Body("role") role: WorkspaceRole,
    @Req() req: RequestWithUser,
  ) {
    return this.workspaceMembersService.addMemberToWorkspace(
      workspaceSlug,
      email,
      role,
      req.user.userId,
    );
  }

  @Patch(":memberId")
  @Permissions(WorkspacePermission.UPDATE_MEMBER_ROLE)
  async updateMemberRole(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("memberId") memberId: string,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.workspaceMembersService.updateMemberRole(
      workspaceSlug,
      memberId,
      updateMemberRoleDto.role,
      req.user.userId,
    );
  }

  @Delete(":memberId")
  @Permissions(WorkspacePermission.REMOVE_MEMBER)
  async removeMemberFromWorkspace(
    @Param("workspaceSlug") workspaceSlug: string,
    @Param("memberId") memberId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.workspaceMembersService.removeMemberFromWorkspace(
      workspaceSlug,
      memberId,
      req.user.userId,
    );
  }
}
