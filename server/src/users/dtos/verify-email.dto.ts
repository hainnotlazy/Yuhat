import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsNumber()
  verificationCode: number;

  @IsNotEmpty()
  @IsString()
  recaptcha: string;
}