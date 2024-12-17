// backend/prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { AWS_CONFIG } from "../src/config/aws.config";

const prisma = new PrismaClient();

const ADMIN_USER = {
  email: "admin@example.com",
  password: "Admin@123456", // Secure password matching Cognito requirements
  firstName: "Admin",
  lastName: "User",
  role: "ADMIN",
};

async function createCognitoUser(email: string, password: string) {
  const cognitoClient = new CognitoIdentityProviderClient({
    region: AWS_CONFIG.region,
    credentials: AWS_CONFIG.credentials,
  });

  // Create user in Cognito
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
    MessageAction: "SUPPRESS",
  });

  const user = await cognitoClient.send(createUserCommand);

  // Set password
  const setPasswordCommand = new AdminSetUserPasswordCommand({
    UserPoolId: AWS_CONFIG.cognito.userPoolId,
    Username: email,
    Password: password,
    Permanent: true,
  });

  await cognitoClient.send(setPasswordCommand);

  return user;
}

async function main() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: ADMIN_USER.email,
      },
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin in Cognito
    const cognitoUser = await createCognitoUser(
      ADMIN_USER.email,
      ADMIN_USER.password,
    );

    // Create admin in database
    const adminUser = await prisma.user.create({
      data: {
        email: ADMIN_USER.email,
        cognitoId: cognitoUser.User.Username,
        firstName: ADMIN_USER.firstName,
        lastName: ADMIN_USER.lastName,
        role: ADMIN_USER.role,
      },
    });

    console.log("Admin user created successfully:", adminUser);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
