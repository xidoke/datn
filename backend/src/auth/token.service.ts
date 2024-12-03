import { Injectable, UnauthorizedException } from "@nestjs/common";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";
import { AWS_CONFIG } from "src/config/aws.config";

@Injectable()
export class TokenService {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
  }

  async refreshAccessToken(refreshTokenData: string) {
    const { token, username } = JSON.parse(refreshTokenData);
    if (!username || !token) {
      throw new UnauthorizedException("Invalid refresh token payload");
    }
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
      if (error.name === "NotAuthorizedException") {
        throw new UnauthorizedException("Refresh token is invalid or expired");
      } else if (error.name === "InvalidParameterException") {
        throw new UnauthorizedException("Invalid parameters for refresh");
      }
      console.error("Error refreshing token:", error);
      throw new UnauthorizedException("Failed to refresh token");
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
