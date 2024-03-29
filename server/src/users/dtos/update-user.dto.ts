import { IsDate, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  fullname: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bio: string;

  @IsOptional()
  // @IsDate()
  // @Matches(/^(\d{4})-(\d{2})-(\d{2})$/)
  dob: Date;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  avatar: string;
}