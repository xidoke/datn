import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminInitiateAuthCommand,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  GlobalSignOutCommand,
  AuthFlowType,
  AdminInitiateAuthCommandInput,
  AdminSetUserPasswordCommandInput,
  InitiateAuthCommand,
  CognitoIdentityProviderServiceException,
} from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'crypto';
import { AWS_CONFIG } from '../config/aws.config';
import { CognitoServiceException } from 'src/exceptions/cognito-service.exception';
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
          Name: 'email',
          Value: email,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
      MessageAction: 'SUPPRESS', // Không gửi email
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
    const hmac = createHmac('SHA256', AWS_CONFIG.cognito.clientSecret)
      .update(message)
      .digest('base64');
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

  async refreshToken(refreshToken: string, username: string) {
    const params: AdminInitiateAuthCommandInput = {
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: AWS_CONFIG.cognito.clientId,
      UserPoolId: AWS_CONFIG.cognito.userPoolId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: this.calculateSecretHash(username),
      },
    };
    const command = new AdminInitiateAuthCommand(params);
    return this.cognitoClient.send(command);
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
    });
    return this.cognitoClient.send(command);
  }

  async confirmForgotPassword(
    email: string,
    code: string,
    newPassword: string
  ) {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: AWS_CONFIG.cognito.clientId,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });
    return this.cognitoClient.send(command);
  }

  async changePassword(
    cognitoId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const params: AdminSetUserPasswordCommandInput = {
      UserPoolId: AWS_CONFIG.cognito.userPoolId,
      Username: cognitoId,
      Password: newPassword,
      Permanent: true,
    };

    const command = new AdminSetUserPasswordCommand(params);

    try {
      return await this.cognitoClient.send(command);
    } catch (error) {
      if (error.name === 'InvalidPasswordException') {
        throw new BadRequestException('Invalid password format');
      }
      throw error;
    }
  }
}
