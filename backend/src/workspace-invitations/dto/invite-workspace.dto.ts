// invite workspace dto

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export enum UserRole {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
  VIEWER = "VIEWER",
}

export class InviteWorkspaceDto {
  @IsString()
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @IsEnum(UserRole, {
    message: "Role must be one of the following values: MEMBER, ADMIN, VIEWER",
  })
  @IsOptional()
  role?: UserRole;
}
