import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { RoomChatService } from './room-chat.service';
import { FileInterceptor } from '@nestjs/platform-express';

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
    // FIXME: Create body by using class-validators
    return this.roomChatService.retrieveOrCreatePersonalChat([currentUser.id, body.userId]);
  }

  @Post("group-chat")
  @UseInterceptors(FileInterceptor("avatar"))
  retrieveOrCreateGroupChat(
    @CurrentUser() currentUser: User, 
    @Body() body: { userId: string[], roomChatName: string }, 
    @UploadedFile() avatar: Express.Multer.File
  ) {
    const usersId = typeof body.userId == "string" ? [body.userId] : body.userId;
    // FIXME: Create body by using class-validators
    return this.roomChatService.retrieveOrCreateGroupChat(body.roomChatName, [currentUser.id, ...usersId], avatar);
  }

  @Post("group-chat/:id/add-user")
  addUserToGroupChat(
    @CurrentUser() currentUser: User,
    @Param("id") roomChatId: string,
    @Body() body: { userId: string }
  ) {
    return this.roomChatService.addUserToGroupChat(currentUser, roomChatId, body.userId);
  }

  @Delete("group-chat/:id/remove-user")
  removeUserFromGroupChat(
    @CurrentUser() currentUser: User, 
    @Param("id") roomChatId: string, 
    @Body() body: { userId: string }
  ) {
    return this.roomChatService.removeUserFromGroupChat(currentUser, roomChatId, body.userId);
  }
}
