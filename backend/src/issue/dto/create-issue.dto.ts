import { IsString, IsUUID, IsOptional, IsArray } from "class-validator";

export class CreateIssueDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  stateId: string;

  @IsUUID()
  projectId: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  assigneeIds?: string[];

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  labelIds?: string[];
}
