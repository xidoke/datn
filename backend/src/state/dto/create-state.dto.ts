import {
  IsString,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from "class-validator";

enum StateGroup {
  BACKLOG = "backlog",
  UNSTARTED = "unstarted",
  STARTED = "started",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export class CreateStateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsHexColor()
  @IsNotEmpty()
  color: string;

  @IsEnum(StateGroup)
  @IsNotEmpty()
  group: StateGroup;

  @IsString()
  @IsOptional()
  description?: string;
}
