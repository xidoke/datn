import { IsOptional, IsString } from "class-validator";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";

export class InviteQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  status?: string;
}
