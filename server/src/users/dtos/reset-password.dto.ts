import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";


export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword: string;

  @IsNotEmpty()
  @IsNumber()
  validationCode: number;
}