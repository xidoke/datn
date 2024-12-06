// src/user/user.service.ts

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CognitoService } from "src/auth/cognito.service";
import { LoginDto } from "src/auth/dto/login.dto";
import { CreateUserDto } from "src/auth/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private cognitoService: CognitoService,
  ) {}

  // DONE
  async create(createUserDto: CreateUserDto) {
    return this.prisma.$transaction(async (prisma) => {
      const cognitoUser = await this.cognitoService.createUser(
        createUserDto.email,
        createUserDto.password,
      );

      return await prisma.user.create({
        data: {
          email: createUserDto.email,
          cognitoId: cognitoUser.User.Username,
          role: "USER",
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
        },
      });
    });
  }

  // DONE
  async login(loginDto: LoginDto) {
    const authResult = await this.cognitoService.authenticateUser(
      loginDto.email,
      loginDto.password,
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

  async findByCognitoId(cognitoId: string) {
    return this.prisma.user.findUnique({
      where: { cognitoId },
    });
  }
}
