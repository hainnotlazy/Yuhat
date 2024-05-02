import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
  ) {}

  @Get("/:roomId")
  getMessages(@CurrentUser() currentUser: User, @Param("roomId") roomId: string) {
    return this.chatService.getMessagesByRoom(currentUser.id, roomId);
  }
}
