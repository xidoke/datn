import { IsNotEmpty, IsString, IsOptional, IsDate, ValidateIf, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

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
  endDate?: Date;

  @IsBoolean()
  isDraft: boolean;
}

export function areDatesValid(startDate: Date | undefined, endDate: Date | undefined): boolean {
  if ((startDate === undefined && endDate === undefined) || (startDate !== undefined && endDate !== undefined)) {
    return true;
  }
  return false;
}

