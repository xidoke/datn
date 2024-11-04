// src/user/user.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode,
  UnauthorizedException,
  Delete,
  Param,
  ForbiddenException,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CognitoAuthGuard } from '../auth/guards/cognito.guard';
import { LoginDto } from './dto/login.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.decorator';
import { RequestWithUser } from './interfaces/request.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(
    @Body()
    { refreshToken, username }: { refreshToken: string; username: string }
  ) {
    return this.userService.refreshToken(refreshToken, username);
  }

  @Post('logout')
  @UseGuards(CognitoAuthGuard)
  @HttpCode(204)
  async logout(@Req() req) {
    return this.userService.globalSignOut(req.user.id);
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() { email }: { email: string }) {
    return this.userService.forgotPassword(email);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body()
    body: {
      email: string;
      code: string;
      newPassword: string;
    }
  ) {
    return this.userService.resetPassword(
      body.email,
      body.code,
      body.newPassword
    );
  }

  @Get()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Delete(':id')
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async deleteUser(@Param('id') id: string, @Req() req: RequestWithUser) {
    // Get current user from database using cognito sub
    const currentUser = await this.userService.findByCognitoId(req.user.sub);
    if (!currentUser) {
      throw new UnauthorizedException('User not found');
    }

    if (req.user.role !== Role.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }

    return this.userService.delete(id);
  }

  @Get('me')
  @UseGuards(CognitoAuthGuard)
  async getCurrentUser(@Req() req: RequestWithUser) {
    console.dir(req.user);
    if (!req.user?.sub) {
      throw new UnauthorizedException('User not found in request');
    }
    return this.userService.findByCognitoId(req.user.sub);
  }

  @Put('me')
  @UseGuards(CognitoAuthGuard)
  async updateCurrentUser(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user = await this.userService.findByCognitoId(req.user.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.userService.update(user.id, updateUserDto);
  }

  @Put(':id')
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Post('change-password')
  @UseGuards(CognitoAuthGuard)
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    const user = await this.userService.findByCognitoId(req.user.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.userService.changePassword(
      user.id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword
    );
  }

  @Get(':id')
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
