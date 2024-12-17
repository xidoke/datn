import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Res,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { ResponseMessage } from "src/common/decorator/response-message.decorator";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { RequestWithUser } from "src/user/interfaces/request.interface";
import { CognitoAuthGuard } from "./guards/cognito.guard";
import { ConfirmForgotPasswordDto } from "./dto/confirm-forgot-password";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage("Registration successful")
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.create(createUserDto);
    if (!user || !user.id) {
      throw new HttpException("Registration failed", HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.authService.login({
        email: createUserDto.email,
        password: createUserDto.password,
      });

      // Set access token in HTTP-only cookie
      response.cookie("access_token", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "none",
        maxAge: 60 * 60 * 1000, // 60p
      });

      // Set refresh token in HTTP-only cookie (if available)
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
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          },
        );
      }

      return {
        user: result.user,
      };
    } catch {
      throw new HttpException(
        "Registration successful but login failed",
        HttpStatus.CREATED,
      );
    }
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Login successful")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Set access token in HTTP-only cookie
    response.cookie("access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set refresh token in HTTP-only cookie (if available)
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
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        },
      );
    }

    // Return user information without tokens
    return { user: result.user };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Logged out successfully")
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "none",
      path: "/",
    });
    response.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "none",
      path: "/",
    });
    return { message: "Logged out successfully" };
  }

  @Post("change-password")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Password changed successfully")
  @UseGuards(CognitoAuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      await this.authService.changePassword(
        req.user.email,
        changePasswordDto.oldPassword,
        changePasswordDto.newPassword,
      );
      return { message: "Password changed successfully" };
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to change password",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Password reset email sent")
  async resetPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    // check email account
    const { email } = forgotPasswordDto;
    try {
      return await this.authService.forgotPassword(email);
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to reset password",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post("confirm-forgot-password")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("OTP confirmed successfully")
  async confirmForgotPassword(
    @Body() confirmForgotPasswordDto: ConfirmForgotPasswordDto,
  ) {
    const { email, code, newPassword } = confirmForgotPasswordDto;
    try {
      return await this.authService.confirmForgotPassword(
        email,
        code,
        newPassword,
      );
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to confirm OTP",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
