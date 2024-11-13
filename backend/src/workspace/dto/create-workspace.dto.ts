import {
  IsOptional,
  IsString,
  isString,
  Length,
  Matches,
  MinLength,
} from "class-validator";

export class CreateWorkspaceDto {
  // slug is required and must be a string with at least 1 character
  @IsString({ message: "Slug must be a string" })
  @Matches(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens",
  })
  @Length(3, 50, { message: "Slug must be between 3 and 50 characters long" })
  slug: string;

  // name is required and must be a string with at least 1 character
  @MinLength(1)
  name: string;

  @IsString()
  @IsOptional()
  @Matches(/\.(jpg|jpeg|png)$/i, {
    message: "logo_url must be a valid image file (jpg, jpeg, png, webp)",
  })
  logo_url?: string;
}
