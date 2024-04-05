import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { NewMessageDto } from './dtos/new-message.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService
  ) {}

  @Get("/:roomId")
  getMessages(@CurrentUser() currentUser: User, @Param("roomId") roomId: string) {
    return this.chatService.getMessagesByRoom(currentUser.id, roomId);
  }

  @Post()
  createNewMessage(@CurrentUser() currentUser: User, @Body() body: NewMessageDto) {
    return this.chatService.createNewMessage(currentUser, body);
  }
}
