// src/user/user.controller.ts

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
} from "@nestjs/common";
import { UserService } from "./user.service";
import { RequestWithUser } from "./interfaces/request.interface";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";
import { plainToInstance } from "class-transformer";

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

  // TODO: deactive account [DELETE /users/me]

  // ------------- /users/me/workspaces ---------------
  @Get("me/workspaces")
  @UseGuards(CognitoAuthGuard)
  async getWorkspaces(@Req() req: RequestWithUser) {
    return this.userService.findUserWorkspaces(req.user.userId);
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
}
