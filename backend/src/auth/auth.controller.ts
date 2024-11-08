import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Res,
  Get,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { CognitoAuthGuard } from "./guards/cognito.guard";
import { LoginDto } from "../user/dto/login.dto";
import { RequestWithUser } from "../user/interfaces/request.interface";
import { ChangePasswordDto } from "../user/dto/change-password.dto";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.OK) // Add this to ensure consistent status code
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = await this.authService.create(createUserDto);
      if (user.id) {
        // Call login but make sure to return its result
        return this.login(
          { email: createUserDto.email, password: createUserDto.password },
          response,
        );
      }
      // Add an else case to handle when user.id doesn't exist
      throw new HttpException("Registration failed", HttpStatus.BAD_REQUEST);
    } catch (error) {
      // Improve error handling
      throw new HttpException(
        error.message || "Registration failed",
        error.statusCode || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const result = await this.authService.login(loginDto);

      // Đặt access token vào HTTP-only cookie
      response.cookie("access_token", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // Sử dụng HTTPS trong production
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 phút
      });

      // Đặt refresh token vào HTTP-only cookie (nếu có)
      if (result.refreshToken) {
        response.cookie(
          "refresh_token",
          JSON.stringify({
            token: result.refreshToken,
            username: result.user.cognitoId,
          }),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          },
        );
      }

      // Trả về thông tin người dùng mà không bao gồm tokens
      return { user: result.user };
    } catch (error) {
      if (error) {
        throw new HttpException(
          error.message,
          error.statusCode || HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("access_token");
    response.clearCookie("refresh_token");
    return;
  }

  // @Post("global-sign-out")
  // @HttpCode(204)
  // async globalLogout(@Req() req) {
  //   return this.authService.globalSignOut(req.user.id);
  // }
}
