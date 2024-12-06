import { IsString, IsHexColor, IsNotEmpty } from "class-validator";

export class CreateLabelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsHexColor()
  @IsNotEmpty()
  color: string;
}
