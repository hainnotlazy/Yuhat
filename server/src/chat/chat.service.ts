import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { Repository } from 'typeorm';
import { NewMessageDto } from './dtos/new-message.dto';
import { User } from 'src/entities/user.entity';
import { RoomChatService } from 'src/room-chat/room-chat.service';
import { RoomChatParticipant } from 'src/entities/room-chat-participant.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private roomChatService: RoomChatService
  ) {}

  async createNewMessage(sender: User, newMessageDto: NewMessageDto) {
    const { roomChatId, content } = newMessageDto;

    const roomChat = await this.roomChatService.findRoomAndParticipants(roomChatId);

    if (!roomChat) {
      throw new NotFoundException("Room chat not found!");
    }

    const participants: RoomChatParticipant[] = roomChat.participants;
    const newMessage = this.messageRepository.create({
      sender, content,
      room: roomChat
    })

    return {
      participants,
      newMessage: await this.messageRepository.save(newMessage)
    }
  }

  async getMessagesByRoom(userId: string, roomChatId: string) {
    const roomChat = await this.roomChatService.findOneByProperty({property: "id", value: roomChatId});

    if (!roomChat) {
      throw new NotFoundException("Room chat not found!");
    }
    // FIXME: Check if user is in roomChat => if no > throw error

    return this.messageRepository.createQueryBuilder("message")
      .select([
        "message.content as content", 
        'message.updatedAt as "sentAt"', 
        'sender.avatar as "senderAvatar"',
        "sender.username as sender",
        `case when message."senderId" = '${userId}' then true else false end as "sentByCurrentUser"`
      ])
      .leftJoin("message.sender", "sender")
      .where("message.room = :roomId", {roomId: roomChatId})
      .getRawMany()
  }
}
