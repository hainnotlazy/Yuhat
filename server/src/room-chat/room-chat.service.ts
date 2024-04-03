import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomChatParticipant } from 'src/entities/room-chat-participant.entity';
import { RoomChat } from 'src/entities/room-chat.entity';
import { UsersService } from 'src/users/users.service';
import { Brackets, DataSource, Repository } from 'typeorm';

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
      .leftJoinAndSelect("roomChat.participants", "participants")
      .leftJoinAndSelect("participants.user", "user")
      .where(qb => {
        const subQuery = qb.subQuery()
          .select('participant."roomChatId"')
          .from(RoomChatParticipant, "participant")
          .where('participant."userId" = :userId')
          .getQuery();
        return "roomChat.id in " + subQuery;
      }).setParameter("userId", userId).getMany();
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
}
