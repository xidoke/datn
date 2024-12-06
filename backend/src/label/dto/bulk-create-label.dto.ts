import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { CreateLabelDto } from "./create-label.dto";

export class BulkCreateLabelDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLabelDto)
  labels: CreateLabelDto[];
}
