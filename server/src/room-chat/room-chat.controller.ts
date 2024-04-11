import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { RoomChatService } from './room-chat.service';

@Controller('room-chat')
export class RoomChatController {
  constructor(private roomChatService: RoomChatService) {}

  @Get()
  findAllRoomChat(@CurrentUser() currentUser: User) {
    return this.roomChatService.findAllRoomChat(currentUser.id);
  }

  @Get("/:id")
  findRoomChat(@CurrentUser() currentUser: User, @Param("id") id: string) {
    return this.roomChatService.findOneById(currentUser.id, id);
  }

  @Post("personal-chat") 
  retrieveOrCreatePersonalChat(@CurrentUser() currentUser: User, @Body() body: { userId: string }) {
    return this.roomChatService.retrieveOrCreatePersonalChat([currentUser.id, body.userId]);
  }
}
