import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { DataSource, Repository } from 'typeorm';
import { NewMessageDto } from './dtos/new-message.dto';
import { User } from 'src/entities/user.entity';
import { RoomChatService } from 'src/room-chat/room-chat.service';
import { RoomChatParticipant } from 'src/entities/room-chat-participant.entity';
import { MessageAttachment } from 'src/entities/message-attachment.entity';
import { UploadFileService } from 'src/shared/services/upload-file/upload-file.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(MessageAttachment)
    private messageAttachmentRepository: Repository<MessageAttachment>,
    private roomChatService: RoomChatService,
    private uploadFileService: UploadFileService,
    private dataSource: DataSource
  ) {}

  async createNewMessage(sender: User, newMessageDto: NewMessageDto, attachments: Array<Express.Multer.File>) {
    const { roomChatId, content } = newMessageDto;

    const roomChat = await this.roomChatService.findRoomAndParticipants(roomChatId);

    if (!roomChat) {
      throw new NotFoundException("Room chat not found!");
    }

    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Save attachments
    const uploadedAttachments: string[] = this.uploadFileService.saveChatAttachments(roomChat.id, attachments);

    try {
      const newMessage = this.messageRepository.create({
        sender, 
        content,
        room: roomChat
      });

      const savedMessage = await queryRunner.manager.save(Message, newMessage);
      
      const savedAttachments: MessageAttachment[] = [];
      for (let attachment of uploadedAttachments) {
        const savedAttachment = await queryRunner.manager.save(MessageAttachment, this.messageAttachmentRepository.create({
          message: savedMessage,
          filePath: attachment
        }));

        savedAttachments.push(savedAttachment);
      }
      savedMessage.attachments = savedAttachments;
      await queryRunner.commitTransaction();

      const participants: RoomChatParticipant[] = roomChat.participants;
      return {
        participants,
        newMessage: savedMessage
      }
    } catch (err) {
      // If error => then remove saved attachment and rollback sql
      this.uploadFileService.removeFiles(uploadedAttachments);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException("Failed when save message!");
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
