// src/user/user.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CognitoService } from './cognito.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from 'src/auth/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cognitoService: CognitoService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const cognitoUser = await this.cognitoService.createUser(
      createUserDto.email,
      createUserDto.password
    );

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        cognitoId: cognitoUser.User.Username,
        role: Role.USER, // Default role,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByCognitoId(cognitoId: string) {
    return this.prisma.user.findUnique({
      where: { cognitoId },
    });
  }

  async login(loginDto: LoginDto) {
    const authResult = await this.cognitoService.authenticateUser(
      loginDto.email,
      loginDto.password
    );

    const user = await this.prisma.user.findFirst({
      where: { email: loginDto.email },
    });

    return {
      accessToken: authResult.AuthenticationResult.AccessToken,
      refreshToken: authResult.AuthenticationResult.RefreshToken,
      user,
    };
  }

  async refreshToken(refreshToken: string, username: string) {
    return this.cognitoService.refreshToken(refreshToken, username);
  }

  async globalSignOut(userId: string) {
    return this.cognitoService.globalSignOut(userId);
  }

  async forgotPassword(email: string) {
    return this.cognitoService.forgotPassword(email);
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    return this.cognitoService.confirmForgotPassword(email, code, newPassword);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.cognitoService.changePassword(
      user.cognitoId,
      oldPassword,
      newPassword
    );

    return user;
  }
}
