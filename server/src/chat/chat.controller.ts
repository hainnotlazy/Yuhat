import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { NewMessageDto } from './dtos/new-message.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadFileService } from 'src/shared/services/upload-file/upload-file.service';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
  ) {}

  @Get("/:roomId")
  getMessages(@CurrentUser() currentUser: User, @Param("roomId") roomId: string) {
    return this.chatService.getMessagesByRoom(currentUser.id, roomId);
  }

  @Post()
  @UseInterceptors(FilesInterceptor("attachments"))
  createNewMessage(
    @CurrentUser() currentUser: User, 
    @Body() body: NewMessageDto, 
    @UploadedFiles() attachments: Array<Express.Multer.File> = []) {
      
    return this.chatService.createNewMessage(currentUser, body, attachments);
  }
}
