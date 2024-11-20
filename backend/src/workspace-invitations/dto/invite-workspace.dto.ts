// invite workspace dto

import { WorkspaceRole } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class InviteWorkspaceDto {
  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @IsEnum(WorkspaceRole, {
    message: "Role must be one of the following values: MEMBER, ADMIN, OWNER",
  })
  role: WorkspaceRole;
}
