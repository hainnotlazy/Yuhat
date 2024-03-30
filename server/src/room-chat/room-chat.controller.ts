import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { RoomChatService } from './room-chat.service';

@Controller('room-chat')
export class RoomChatController {
  constructor(private roomChatService: RoomChatService) {}

  @Post("personal-chat") 
  createPersonalChat(@CurrentUser() currentUser: User, @Body() body: { userId: string }) {
    return this.roomChatService.createPersonalChat([currentUser.id, body.userId]);
  }
}
