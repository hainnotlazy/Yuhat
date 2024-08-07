import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { RoomChatModule } from 'src/room-chat/room-chat.module';
import { SharedModule } from 'src/shared/shared.module';
import { MessageAttachment } from 'src/entities/message-attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, MessageAttachment]),
    AuthModule, 
    RoomChatModule,
    SharedModule
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
