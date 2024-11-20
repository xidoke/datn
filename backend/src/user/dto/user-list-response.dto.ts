import { UserDto } from "./user.dto";

export class UserListResponseDto {
  users: UserDto[];

  totalCount: number;

  page: number;

  pageSize: number;
}
