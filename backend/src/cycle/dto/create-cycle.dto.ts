import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  ValidateIf,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateCycleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ValidateIf((o) => o.endDate !== undefined || o.startDate !== undefined)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ValidateIf((o) => o.startDate !== undefined || o.endDate !== undefined)
  dueDate?: Date;
}

export function areDatesValid(
  startDate: Date | undefined,
  dueDate: Date | undefined,
): boolean {
  if (
    (startDate === undefined && dueDate === undefined) ||
    (startDate !== undefined && dueDate !== undefined)
  ) {
    return true;
  }
  return false;
}
