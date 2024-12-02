import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Res,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { ResponseMessage } from "src/common/decorator/response-message.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage("Registration successful")
  async register(@Body() createUserDto: CreateUserDto,
 @Res({ passthrough: true }) response: Response,) {
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
}
