import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @Expose()
  @IsOptional()
  @IsString()
  firstName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  lastName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  lastWorkspaceSlug?: string;

  
}
