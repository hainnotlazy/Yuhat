import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: "Password is invalid" })
  @MaxLength(100, { message: "Password is invalid"})
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: "New password must have more than 8 characters" })
  @MaxLength(100, { message: "New password must have less than 100 characters" })
  newPassword: string;
}