import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IEntityProperty } from 'src/common/interfaces/entity-property.interface';
import { RoomChatParticipant } from 'src/entities/room-chat-participant.entity';
import { RoomChat } from 'src/entities/room-chat.entity';
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
    private usersService: UsersService
  ) {}

  async findAllRoomChat(userId: string) {
    return this.roomChatRepository.createQueryBuilder("roomChat")
      .distinctOn(["roomChat.id"])
      .select(
        ["roomChat.id as id", 
        "roomChat.type as type", 
        'users.fullname as "participantName"', 
        'users.avatar as "participantAvatar"', 
        'messages.content as "latestMessage"',
        'messages."createdAt" as "latestMessageSentAt"'
      ])
      .leftJoin("roomChat.participants", "participants")
      .leftJoin("roomChat.messages", "messages")
      .leftJoin("participants.user", "users")
      .where(qb => {
        const subQuery = qb.subQuery()
          .select('participant."roomChatId"')
          .from(RoomChatParticipant, "participant")
          .where('participant."userId" = :userId')
          .getQuery();
        return "roomChat.id in " + subQuery;
      }).setParameter("userId", userId)
      .andWhere('participants."userId" != :user', {user: userId})
      .andWhere("messages.content != ''")
      .orderBy('roomChat.id, messages."createdAt"', "DESC")
      .getRawMany();
  }

  /**
   * Note: Personal Chat is chat just including 2 peoples
   */
  async createPersonalChat(userIds: string[]) {
    if (userIds.length != 2) throw new BadRequestException("Must include 2 userIds");
    if (await this.isPersonalChatExisted(userIds)) throw new BadRequestException("2 this user have already had personal chat");

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const roomChat = this.roomChatRepository.create({
        type: "personal"
      });
      const savedRoomChat = await queryRunner.manager.save(RoomChat, roomChat);

      for (let i = 0; i < userIds.length; i ++) {
        const user = await this.usersService.findOneByProperty({property: "id", value: userIds[i]});

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

  private async isPersonalChatExisted(userIds: string[]) {
    const [userId1, userId2] = userIds;

    // Query to check if a personal chat exists between the two users
    const existingChat = await this.roomChatRepository
      .createQueryBuilder('roomChat')
      .innerJoin('roomChat.participants', 'participant1')
      .innerJoin('roomChat.participants', 'participant2')
      .where('participant1.userId = :userId1', { userId1 })
      .andWhere('participant2.userId = :userId2', { userId2 })
      .andWhere('roomChat.type = :type', { type: 'personal' })
      .getOne();

    return !!existingChat;
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
