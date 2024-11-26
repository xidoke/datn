import { Type } from "class-transformer";
import { IsArray, ValidateNested, IsString } from "class-validator";
import { UpdateLabelDto } from "./update-label.dto";

class UpdateLabelItem {
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => UpdateLabelDto)
  data: UpdateLabelDto;
}

export class BulkUpdateLabelDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateLabelItem)
  labels: UpdateLabelItem[];
}
