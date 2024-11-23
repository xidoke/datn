import { IsOptional, IsString, MinLength } from "class-validator";

// update workspace dto
export class UpdateWorkspaceDto {
  @MinLength(1)
  @IsString()
  @IsOptional()
  name?: string;
}
