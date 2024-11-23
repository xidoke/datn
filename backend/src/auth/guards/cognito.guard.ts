import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Request, Response } from "express";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";
import { AWS_CONFIG } from "src/config/aws.config";
import { AuthService } from "../auth.service";

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private readonly jwtVerifier: any;
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {
    this.jwtVerifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      tokenUse: "access",
      clientId: process.env.COGNITO_CLIENT_ID,
    });

    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const token = request.cookies.access_token;
    const refreshToken = request.cookies.refresh_token;
    if (!token && !refreshToken) {
      throw new UnauthorizedException("No access token provided");
    }
    try {
      const payload = await this.jwtVerifier.verify(token);
      const cognitoId = payload.sub;

      // Fetch user from database
      const user = await this.authService.findByCognitoId(cognitoId);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      request["user"] = {
        ...payload,
        role: user.role,
        userId: user.id,
        email: user.email,
      };

      // Check role-based access
      const requiredRoles = this.reflector.get<string[]>(
        "roles",
        context.getHandler(),
      );
      if (requiredRoles && !requiredRoles.includes(user.role)) {
        throw new ForbiddenException("Insufficient permissions");
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      // Access token is invalid or expired, try to refresh
      const refreshTokenData = request.cookies.refresh_token;
      if (!refreshTokenData) {
        throw new UnauthorizedException("No refresh token available");
      }

      try {
        const newTokens = await this.refreshAccessToken(refreshTokenData);
        // Set new cookies
        response.cookie("access_token", newTokens.AccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "lax",
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        if (newTokens.RefreshToken) {
          response.cookie("refresh_token", newTokens.RefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
        }

        // Verify the new access token
        const payload = await this.jwtVerifier.verify(newTokens.AccessToken);
        const cognitoId = payload.sub;

        // Fetch user from database
        const user = await this.authService.findByCognitoId(cognitoId);
        if (!user) {
          throw new UnauthorizedException("User not found");
        }

        request["user"] = { ...payload, role: user.role, userId: user.id };

        // Check role-based access again
        const requiredRoles = this.reflector.get<string[]>(
          "roles",
          context.getHandler(),
        );
        if (requiredRoles && !requiredRoles.includes(user.role)) {
          throw new ForbiddenException("Insufficient permissions");
        }

        return true;
      } catch (refreshError) {
        console.error(refreshError);
        throw new UnauthorizedException("Failed to refresh token");
      }
    }
  }

  private async refreshAccessToken(refreshTokenData: string) {
    const { token, username } = JSON.parse(refreshTokenData);
    const command = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: token,
        SECRET_HASH: this.calculateSecretHash(username),
      },
    });

    try {
      const response = await this.cognitoClient.send(command);
      return response.AuthenticationResult;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }

  private calculateSecretHash(username: string): string {
    const message = username + AWS_CONFIG.cognito.clientId;
    const hmac = createHmac("SHA256", AWS_CONFIG.cognito.clientSecret)
      .update(message)
      .digest("base64");
    return hmac;
  }
}
