import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IEntityProperty } from 'src/common/interfaces/entity-property.interface';
import { RoomChatParticipant } from 'src/entities/room-chat-participant.entity';
import { RoomChat } from 'src/entities/room-chat.entity';
import { UploadFileService } from 'src/shared/services/upload-file/upload-file.service';
import { UsersService } from 'src/users/users.service';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RoomChatService {
  constructor(
    @InjectRepository(RoomChat)
    private roomChatRepository: Repository<RoomChat>,
    @InjectRepository(RoomChatParticipant)
    private roomChatParticipantRepository: Repository<RoomChatParticipant>,
    private dataSource: DataSource,
    private usersService: UsersService,
    private uploadFileService: UploadFileService
  ) {}

  async findAllRoomChat(userId: string) {
    return this.roomChatRepository.createQueryBuilder("roomChat")
      .leftJoin('roomChat.messages', "messages")
      .leftJoin("roomChat.participants", "participants")
      .leftJoin("participants.user", "users")
      .leftJoin("messages.attachments", "attachments")
      .leftJoin("messages.sender", "sender")
      .where(`messages.id in 
        (select subquery.id 
        from (select id, row_number() over (partition by "roomId" order by "createdAt" desc) as rn 
          from message) as subquery
          where rn = 1)`)
      .andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('participant."roomChatId"')
          .from(RoomChatParticipant, "participant")
          .where('participant."userId" = :participantId')
          .getQuery();
        return "roomChat.id in " + subQuery;
      }).setParameter("participantId", userId)
      .andWhere('users.id != :userId', {userId})
      .orderBy('messages."createdAt"', "DESC")
      .select([
        'roomChat.id', 
        'roomChat.name', 
        'roomChat.avatar', 
        'roomChat.type', 
        'users.id', 
        'users.username', 
        'users.fullname', 
        'users.avatar', 
        'participants.role',
        'messages.content',
        'sender.fullname',
        'messages.createdAt',
        'attachments.filePath',
      ])
      .getMany();
  }

  async findOneById(userId: string, id: string) {
    return this.roomChatRepository.createQueryBuilder("roomChat")
      // .leftJoin('roomChat.messages', "messages")
      .leftJoin("roomChat.participants", "participants")
      .leftJoin("participants.user", "users")
      // .leftJoin("messages.attachments", "attachments")
      .where("roomChat.id = :roomChatId", {roomChatId: id})
      .andWhere("users.id != :userId", {userId})
      .select([
        'roomChat.id', 
        'roomChat.name', 
        'roomChat.avatar', 
        'roomChat.type', 
        'users.id', 
        'users.username', 
        'users.fullname', 
        'users.avatar', 
        'participants.role',
        // 'messages.content',
        // 'messages.createdAt',
        // 'attachments.filePath',
      ])
      .getOne();
  }

  /**
   * Note: Personal Chat is chat just including 2 peoples
   */
  async retrieveOrCreatePersonalChat(userIds: string[]) {
    if (userIds.length != 2) throw new BadRequestException("Must include 2 userIds");
    
    // Check if chat is existed?
    const existedChat = await this.findPersonalChat(userIds);
    if (existedChat) {
      return existedChat;
    }

    // Else create new chat
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const roomChat = this.roomChatRepository.create({
        type: "personal"
      });
      const savedRoomChat = await queryRunner.manager.save(RoomChat, roomChat);

      for (let userId of userIds) {
        const user = await this.usersService.findOneByProperty({property: "id", value: userId});

        if (!user) throw new NotFoundException("User not found!");

        const participant = this.roomChatParticipantRepository.create({
          user: user,
          roomChat: savedRoomChat,
          role: "owner"
        })
        await queryRunner.manager.save(RoomChatParticipant, participant);
      }
      await queryRunner.commitTransaction();
      return savedRoomChat;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException("Failed when creating personal room chat!");
    } finally {
      await queryRunner.release();
    }
  }

  async retrieveOrCreateGroupChat(roomChatName: string, userIds: string[], avatar: Express.Multer.File | undefined) {
    if (userIds.length < 2) throw new BadRequestException("Must include at least 1 user");

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const roomChat = this.roomChatRepository.create({
        name: roomChatName,
        avatar: avatar ? await this.uploadFileService.saveAvatar(avatar) : "public/avatars/default-group-chat.jpg",
        type: "group",
      });
      const savedRoomChat = await queryRunner.manager.save(RoomChat, roomChat);

      for (let userId of userIds) {
        const user = await this.usersService.findOneByProperty({property: "id", value: userId});

        if (!user) throw new NotFoundException("User not found!");

        const participant = this.roomChatParticipantRepository.create({
          user: user,
          roomChat: savedRoomChat,
          role: "owner"
        })
        await queryRunner.manager.save(RoomChatParticipant, participant);
      }
      await queryRunner.commitTransaction();
      return savedRoomChat;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException("Failed when creating group chat!");
    } finally {
      await queryRunner.release();
    }
  }

  private async findPersonalChat(userIds: string[]) {
    const [userId1, userId2] = userIds;

    // Query to check if a personal chat exists between the two users
    return await this.roomChatRepository
      .createQueryBuilder('roomChat')
      .innerJoin('roomChat.participants', 'participant1')
      .innerJoin('roomChat.participants', 'participant2')
      .where('participant1.userId = :userId1', { userId1 })
      .andWhere('participant2.userId = :userId2', { userId2 })
      .andWhere('roomChat.type = :type', { type: 'personal' })
      .getOne();
  }

  findOneByProperty(property: IEntityProperty) {
    return this.roomChatRepository.createQueryBuilder()
      .where(`${property.property} = :value`, {value: property.value})
      .getOne();
  }

  findRoomAndParticipants(roomChatId: string) {
    return this.roomChatRepository.createQueryBuilder("roomChat")
      .leftJoinAndSelect("roomChat.participants", "participants")
      .where("roomChat.id = :roomChatId", {roomChatId})
      .getOne();
  }
}
