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
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CognitoAuthGuard } from "../auth/guards/cognito.guard";
import { LoginDto } from "./dto/login.dto";
import { RequestWithUser } from "./interfaces/request.interface";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { Response, Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @HttpCode(HttpStatus.OK) // Add this to ensure consistent status code
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = await this.userService.create(createUserDto);
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
      const result = await this.userService.login(loginDto);

      // Đặt access token vào HTTP-only cookie
      response.cookie("access_token", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // Sử dụng HTTPS trong production
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 phút
      });

      // Đặt refresh token vào HTTP-only cookie (nếu có)
      if (result.refreshToken) {
        response.cookie("refresh_token", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });
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

  @Post("refresh-token")
  @HttpCode(200)
  async refreshToken(
    @Body()
    { refreshToken, username }: { refreshToken: string; username: string },
  ) {
    return this.userService.refreshToken(refreshToken, username);
  }

  @Post("global-sign-out")
  @UseGuards(CognitoAuthGuard)
  @HttpCode(204)
  async globalLogout(@Req() req) {
    return this.userService.globalSignOut(req.user.id);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax" as const,
      path: "/",
    };

    response.clearCookie("access_token", cookieOptions);
    response.clearCookie("refresh_token", cookieOptions);

    // Log để debug
    console.log("Cookies cleared:", response.getHeader("Set-Cookie"));

    return { message: "Logged out successfully" };
  }

  @Post("forgot-password")
  @HttpCode(200)
  async forgotPassword(@Body() { email }: { email: string }) {
    return this.userService.forgotPassword(email);
  }

  @Post("reset-password")
  @HttpCode(200)
  async resetPassword(
    @Body()
    body: {
      email: string;
      code: string;
      newPassword: string;
    },
  ) {
    return this.userService.resetPassword(
      body.email,
      body.code,
      body.newPassword,
    );
  }

  @Post("change-password")
  @UseGuards(CognitoAuthGuard)
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
}
