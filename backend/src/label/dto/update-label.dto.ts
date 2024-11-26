import { IsString, IsHexColor, IsOptional } from "class-validator";

export class UpdateLabelDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsHexColor()
  @IsOptional()
  color?: string;
}
