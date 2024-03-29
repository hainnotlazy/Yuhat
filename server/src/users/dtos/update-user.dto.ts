import { IsDate, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Fullname must have more than 3 characters" })
  @MaxLength(255, { message: "Fullname must have less than 255 characters" })
  fullname: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: "Bio must have less than 255 characters" })
  bio: string;

  @IsOptional()
  dob: Date;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  avatar: string;
}