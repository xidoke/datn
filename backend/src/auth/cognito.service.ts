import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminInitiateAuthCommand,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  GlobalSignOutCommand,
  AuthFlowType,
  CognitoIdentityProviderServiceException,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";
import { AWS_CONFIG } from "../config/aws.config";
import { CognitoServiceException } from "src/common/exceptions/cognito-service.exception";
@Injectable()
export class CognitoService {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: AWS_CONFIG.region,
      credentials: AWS_CONFIG.credentials,
    });
  }

  async createUser(email: string, password: string) {
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: AWS_CONFIG.cognito.userPoolId,
      Username: email,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
      MessageAction: "SUPPRESS", // Không gửi email
    });

    const user = await this.cognitoClient.send(createUserCommand);

    // Set password cho user
    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: AWS_CONFIG.cognito.userPoolId,
      Username: email,
      Password: password,
      Permanent: true,
    });

    await this.cognitoClient.send(setPasswordCommand);

    return user;
  }

  private calculateSecretHash(username: string): string {
    const message = username + AWS_CONFIG.cognito.clientId;
    const hmac = createHmac("SHA256", AWS_CONFIG.cognito.clientSecret)
      .update(message)
      .digest("base64");
    return hmac;
  }

  async authenticateUser(email: string, password: string) {
    try {
      const command = new AdminInitiateAuthCommand({
        AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
        UserPoolId: AWS_CONFIG.cognito.userPoolId,
        ClientId: AWS_CONFIG.cognito.clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: this.calculateSecretHash(email),
        },
      });

      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      if (error instanceof CognitoIdentityProviderServiceException) {
        throw new CognitoServiceException(error);
      }
      throw new HttpException(error.message, 500);
    }
  }

  async globalSignOut(username: string) {
    const command = new GlobalSignOutCommand({
      AccessToken: username,
    });
    return this.cognitoClient.send(command);
  }

  async forgotPassword(email: string) {
    const command = new ForgotPasswordCommand({
      ClientId: AWS_CONFIG.cognito.clientId,
      Username: email,
      SecretHash: this.calculateSecretHash(email),
    });
    return this.cognitoClient.send(command);
  }

  async confirmForgotPassword(
    email: string,
    code: string,
    newPassword: string,
  ) {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: AWS_CONFIG.cognito.clientId,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: this.calculateSecretHash(email),
    });
    return this.cognitoClient.send(command);
  }

  async deleteUser(username: string) {
    const deleteUserCommand = new AdminDeleteUserCommand({
      UserPoolId: AWS_CONFIG.cognito.userPoolId,
      Username: username,
    });

    try {
      await this.cognitoClient.send(deleteUserCommand);
      return { message: `User ${username} successfully deleted from Cognito` };
    } catch (error) {
      console.error("Error deleting user from Cognito:", error);
      throw new Error(
        `Failed to delete user ${username} from Cognito: ${error.message}`,
      );
    }
  }

  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ) {
    try {
      // First, verify the old password
      const authCommand = new AdminInitiateAuthCommand({
        AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
        UserPoolId: AWS_CONFIG.cognito.userPoolId,
        ClientId: AWS_CONFIG.cognito.clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: oldPassword,
          SECRET_HASH: this.calculateSecretHash(email),
        },
      });

      await this.cognitoClient.send(authCommand);

      // If authentication is successful, proceed to change the password
      const changePasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: AWS_CONFIG.cognito.userPoolId,
        Username: email,
        Password: newPassword,
        Permanent: true,
      });

      await this.cognitoClient.send(changePasswordCommand);
      return { message: `Password for user ${email} successfully changed` };
    } catch (error) {
      if (error instanceof CognitoIdentityProviderServiceException) {
        if (error.name === "NotAuthorizedException") {
          throw new BadRequestException("Incorrect old password");
        }
        throw new CognitoServiceException(error);
      }
      throw new HttpException(
        `Failed to change password for user ${email}: ${error.message}`,
        500,
      );
    }
  }
}
