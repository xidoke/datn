import { IsOptional, IsEnum } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { Role } from "src/auth/enums/role.enum";

export class CreateAdminUserDto extends CreateUserDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
