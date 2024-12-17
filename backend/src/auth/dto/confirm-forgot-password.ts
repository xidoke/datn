import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class ConfirmForgotPasswordDto {
  @IsEmail({}, { message: "Email must be a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  // OTP
  @IsNotEmpty({ message: "OTP is required" })
  @IsNumberString({}, { message: "OTP must be a number" })
  @Length(6, 6, { message: "OTP must be 6 characters" })
  code: string;

  // New password
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
  newPassword: string;
}
