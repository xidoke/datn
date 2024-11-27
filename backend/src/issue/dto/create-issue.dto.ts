import {
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
  IsNumber,
  Max,
  Min,
  IsDate,
  IsDateString,
} from "class-validator";
export class CreateIssueDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsUUID()
  stateId?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  assigneeIds?: string[];

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  labelIds?: string[];

  @IsNumber()
  @Min(0, { message: "priority must be greater than or equal to 0" })
  @Max(4, { message: "priority must be less than or equal to 4" })
  @IsOptional()
  priority?: number;

  // Due date field
  @IsDateString()
  @IsOptional()
  dueDate?: Date;
}
