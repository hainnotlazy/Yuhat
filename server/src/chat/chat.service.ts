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
import { Attachment } from './dtos/attachment.dto';

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

  async createNewMessage(sender: User, newMessageDto: NewMessageDto, attachments: Attachment[] = []) {
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
      await queryRunner.commitTransaction();
      
      savedMessage.attachments = savedAttachments;
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
    const messages = await this.messageRepository.createQueryBuilder("message")
      .select([
        "message.content", 
        'message.createdAt', 
        'message.updatedAt', 
        'sender.id',
        'sender.avatar',
        'sender.fullname',
        "sender.username",
        "attachments.filePath"
      ])
      .leftJoin("message.sender", "sender")
      .leftJoin("message.attachments", "attachments")
      .where("message.room = :roomId", {roomId: roomChatId})
      .orderBy("message.createdAt", "ASC")
      .getMany();
    
    messages.map((message: any) => {
      message.sentByCurrentUser = message.sender.id === userId;
    })
    
    return messages;
  }
}
