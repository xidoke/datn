import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsString({ message: "Old password must be a valid string." })
  @MinLength(8, { message: "Old password must be at least 8 characters long." })
  @MaxLength(99, { message: "Old password must not exceed 99 characters." })
  @Matches(/[A-Z]/, {
    message: "Old password must include at least one uppercase letter.",
  })
  @Matches(/[a-z]/, {
    message: "Old password must include at least one lowercase letter.",
  })
  @Matches(/[0-9]/, {
    message: "Old password must include at least one number.",
  })
  @Matches(/[@$!%*?&]/, {
    message:
      "Old password must include at least one special character (@, $, !, %, *, ?, &).",
  })
  @Matches(/^[^\s]+$/, { message: "Old password must not contain spaces." })
  oldPassword: string;

  @IsString({ message: "New password must be a valid string." })
  @MinLength(8, { message: "New password must be at least 8 characters long." })
  @MaxLength(99, { message: "New password must not exceed 99 characters." })
  @Matches(/[A-Z]/, {
    message: "New password must include at least one uppercase letter.",
  })
  @Matches(/[a-z]/, {
    message: "New password must include at least one lowercase letter.",
  })
  @Matches(/[0-9]/, {
    message: "New password must include at least one number.",
  })
  @Matches(/[@$!%*?&]/, {
    message:
      "New password must include at least one special character (@, $, !, %, *, ?, &).",
  })
  @Matches(/^[^\s]+$/, { message: "New password must not contain spaces." })
  newPassword: string;
}
