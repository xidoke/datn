import {
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from "class-validator";

export class UpdateIssueDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  stateId?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  assigneeIds?: string[];

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  labelIds?: string[];

  // priority field
  // number từ 0 đến 4
  @IsNumber()
  @Min(0, { message: "priority must be greater than or equal to 0" })
  @Max(4, { message: "priority must be less than or equal to 4" })
  @IsOptional()
  priority?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsUUID()
  @IsOptional()
  cycleId?: string;
}
