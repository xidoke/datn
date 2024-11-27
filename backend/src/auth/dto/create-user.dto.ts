import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(99, { message: "Password must be at most 99 characters long" })
  @Matches(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  @Matches(/[0-9]/, { message: "Password must contain at least one digit" })
  @Matches(/[@$!%*?&]/, {
    message:
      "Password must contain at least one special character (@, $, !, %, *, ?, &)",
  })
  // không chứa khoảng trắng
  @Matches(/^[^\s]+$/, { message: "Password must not contain any spaces" })
  password: string;

  @IsString({ message: "First name must be a string" })
  @MaxLength(30, { message: "First name must be at most 30 characters long" })
  firstName: string;

  @IsString({ message: "Last name must be a string" })
  @MaxLength(30, { message: "Last name must be at most 30 characters long" })
  lastName: string;
}
