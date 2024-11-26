import {
  IsString,
  IsHexColor,
  IsOptional,
  IsEnum,
  IsBoolean,
} from "class-validator";

enum StateGroup {
  BACKLOG = "backlog",
  UNSTARTED = "unstarted",
  STARTED = "started",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export class UpdateStateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsHexColor()
  @IsOptional()
  color?: string;

  @IsEnum(StateGroup)
  @IsOptional()
  group?: StateGroup;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
