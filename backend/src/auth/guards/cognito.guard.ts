import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Request, Response } from "express";
import { AuthService } from "../auth.service";
import { TokenService } from "../token.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { SimpleJwksCache } from "aws-jwt-verify/jwk";
import { SimpleJsonFetcher } from "aws-jwt-verify/https";

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private readonly jwtVerifier: any;
  private refreshTokenPromise: Promise<any> | null = null;

  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private tokenService: TokenService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.jwtVerifier = CognitoJwtVerifier.create(
      {
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        tokenUse: "access",
        clientId: process.env.COGNITO_CLIENT_ID,
      },
      {
        jwksCache: new SimpleJwksCache({
          fetcher: new SimpleJsonFetcher({
            defaultRequestOptions: {
              responseTimeout: 5000,
            },
          }),
        }),
      },
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    let token = this.extractTokenFromRequest(request);

    if (!token) {
      // Attempt to refresh token if access token is missing
      try {
        await this.refreshToken(request, response);
        token = this.extractTokenFromRequest(request);
        if (!token) {
          throw new UnauthorizedException("Failed to refresh token");
        }
      } catch (error) {
        throw error;
      }
    }

    try {
      const user = await this.validateToken(token);
      request["user"] = user;
      await this.checkUserPermissions(user, context);
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      return this.handleTokenError(error, request, response);
    }
  }

  private extractTokenFromRequest(request: Request): string | null {
    return request.cookies.access_token || null;
  }

  private async validateToken(token: string) {
    const cachedUser = await this.cacheManager.get(token);
    if (cachedUser) {
      return cachedUser;
    }

    try {
      const payload = await this.jwtVerifier.verify(token);
      const cognitoId = payload.sub;
      const user = await this.authService.findByCognitoId(cognitoId);

      if (!user) {
        throw new UnauthorizedException("User not found!");
      }

      const userInfo = {
        ...payload,
        role: user.role,
        userId: user.id,
        email: user.email,
      };

      await this.cacheManager.set(token, userInfo, 60 * 1000); // Cache for 1 minute
      return userInfo;
    } catch (error) {
      console.error("Token validation error:", error);
      throw error;
    }
  }

  private async checkUserPermissions(user: any, context: ExecutionContext) {
    const requiredRoles = this.reflector.get<string[]>(
      "roles",
      context.getHandler(),
    );
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException("Insufficient permissions");
    }

    if (user.role === "USER" && user.isActive === false) {
      throw new ForbiddenException("User is blocked");
    }
  }

  private async handleTokenError(
    error: any,
    request: Request,
    response: Response,
  ): Promise<boolean> {
    console.log("Token error:", error);
    if (error.name === "TokenExpiredError") {
      return this.refreshToken(request, response);
    } else if (error.name === "JsonWebTokenError") {
      throw new UnauthorizedException("Invalid token");
    } else if (error.name === "NotBeforeError") {
      throw new UnauthorizedException("Token not active");
    } else {
      throw new UnauthorizedException("Authentication failed");
    }
  }

  private async refreshToken(
    request: Request,
    response: Response,
  ): Promise<boolean> {
    if (this.refreshTokenPromise) {
      await this.refreshTokenPromise;
      return true;
    }

    const refreshTokenData = request.cookies.refresh_token;
    if (!refreshTokenData) {
      throw new UnauthorizedException("No refresh token available");
    }

    this.refreshTokenPromise =
      this.tokenService.refreshAccessToken(refreshTokenData);

    try {
      const newTokens = await this.refreshTokenPromise;
      const oldToken = request.cookies.access_token;
      if (oldToken) {
        await this.cacheManager.del(oldToken);
      }
      this.setTokenCookies(response, newTokens);
      const user = await this.validateToken(newTokens.AccessToken);
      request["user"] = user;
      return true;
    } catch {
      //  (refreshError)
      // console.error("Token refresh error:", refreshError);
      this.clearTokenCookies(response);
      throw new UnauthorizedException("Failed to refresh token");
    } finally {
      this.refreshTokenPromise = null;
    }
  }

  private setTokenCookies(response: Response, tokens: any) {
    response.cookie("access_token", tokens.AccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 60 minutes
    });

    if (tokens.RefreshToken) {
      response.cookie("refresh_token", tokens.RefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }
  }

  private clearTokenCookies(response: Response) {
    response.clearCookie("access_token");
    response.clearCookie("refresh_token");
  }
}
