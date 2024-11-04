// src/auth/guards/cognito.guard.ts

import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { AWS_CONFIG } from "../../config/aws.config";

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private verifier = CognitoJwtVerifier.create({
    userPoolId: AWS_CONFIG.cognito.userPoolId,
    clientId: AWS_CONFIG.cognito.clientId,
    tokenUse: "access",
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) return false;

    try {
      const payload = await this.verifier.verify(token);
      request.user = payload;
      return true;
    } catch {
      return false;
    }
  }
}
