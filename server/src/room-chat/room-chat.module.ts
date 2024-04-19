import { Module } from '@nestjs/common';
import { RoomChatService } from './room-chat.service';
import { RoomChatController } from './room-chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomChat } from 'src/entities/room-chat.entity';
import { RoomChatParticipant } from 'src/entities/room-chat-participant.entity';
import { UsersModule } from 'src/users/users.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomChat, RoomChatParticipant]),
    UsersModule,
    SharedModule
  ],
  providers: [RoomChatService],
  controllers: [RoomChatController],
  exports: [RoomChatService]
})
export class RoomChatModule {}
