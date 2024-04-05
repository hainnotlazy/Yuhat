import { IsNotEmpty, IsString } from "class-validator";

export class NewMessageDto {
  @IsNotEmpty()
  @IsString()
  roomChatId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}