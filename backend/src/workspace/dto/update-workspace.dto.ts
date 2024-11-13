import { IsOptional, IsString, Matches, MinLength } from "class-validator";

// update workspace dto
export class UpdateWorkspaceDto {
  @MinLength(1)
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/\.(jpg|jpeg|png)$/i, {
    message: "logo_url must be a valid image file (jpg, jpeg, png, webp)",
  })
  logo_url?: string;
}
