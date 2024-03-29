import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: "Password must have more than 5 characters" })
  @MaxLength(50, { message: "Password must have less than 50 characters"})
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: "Password must have more than 8 characters" })
  @MaxLength(100, { message: "Password must have less than 100 characters"})
  password: string;

  @IsOptional()
  @IsEmail()
  email: string;
}