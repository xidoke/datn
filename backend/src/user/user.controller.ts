import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  Param,
  NotFoundException,
  Patch,
  Query,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { RequestWithUser } from "./interfaces/request.interface";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";
import { plainToInstance } from "class-transformer";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { PaginationQueryDto } from "./dto/pagination-query.dto";
import { UserListResponseDto } from "./dto/user-list-response.dto";
import { CreateAdminUserDto } from "./dto/create-admin-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ------------- /users/me ---------------

  // DONE
  @Get("me")
  @UseGuards(CognitoAuthGuard)
  async me(@Req() req: RequestWithUser) {
    return this.userService.findByCognitoId(req.user.sub);
  }

  // DONE
  @Patch("me/")
  @UseGuards(CognitoAuthGuard)
  async updateUserInfo(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.findByCognitoId(req.user.sub);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    // Chỉ lấy các trường được phép từ DTO
    const sanitizedUpdateData = plainToInstance(UpdateUserDto, updateUserDto, {
      excludeExtraneousValues: true,
    });

    // Cập nhật user với dữ liệu đã được sanitize
    return this.userService.update(user.id, sanitizedUpdateData);
  }

  // DONE
  @Post("me/avatar")
  @UseGuards(CognitoAuthGuard)
  @UseInterceptors(FileInterceptor("avatar"))
  async uploadAvatar(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }
    return this.userService.updateAvatar(req.user.userId, file);
  }

  @Post("change-password")
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.userService.findByCognitoId(req.user.sub);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return this.userService.changePassword(
      user.id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  @Get("me/invitations")
  @UseGuards(CognitoAuthGuard)
  async getInvitations(
    @Req() req: RequestWithUser,
    @Query("status") status?: string,
  ) {
    return this.userService.getInvitations(req.user.email, status);
  }

  @Post("me/invitations/:invitationId/accept")
  @UseGuards(CognitoAuthGuard)
  async acceptInvitation(
    @Param("invitationId") invitationId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.userService.acceptInvitation(invitationId, req.user.userId);
  }

  @Post("me/invitations/:invitationId/reject")
  @UseGuards(CognitoAuthGuard)
  async rejectInvitation(
    @Param("invitationId") invitationId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.userService.rejectInvitation(invitationId, req.user.userId);
  }

  // ADMIN
  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(CognitoAuthGuard)
  async getAllUsers(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<UserListResponseDto> {
    const { users, totalCount } =
      await this.userService.findAll(paginationQuery);
    return {
      users,
      totalCount,
      page: paginationQuery.page,
      pageSize: paginationQuery.pageSize,
    };
  }

  // retrieve user by userId
  @Get(":userId")
  @Roles(Role.ADMIN)
  @UseGuards(CognitoAuthGuard)
  async getUserByUserId(@Param("userId") userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  // create user (admin only)
  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(CognitoAuthGuard)
  async createUser(@Body() createUserDto: CreateAdminUserDto) {
    return this.userService.create(createUserDto);
  }

  // Delete user by userId
  @Delete(":userId")
  @Roles(Role.ADMIN)
  @UseGuards(CognitoAuthGuard)
  async deleteUser(@Param("userId") userId: string) {
    return this.userService.deleteUser(userId);
  }
}
