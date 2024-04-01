import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { RoomChat } from "./room-chat.entity";
import { User } from "./user.entity";

enum ParticipantRole {
  "OWNER" = "owner",
  "MODERATOR" = "moderator",
  "MEMBER" = "member"
}

@Entity()
export class RoomChatParticipant {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  roomChatId: string;

  @ManyToOne(() => User, user => user.Participants)
  user: User;

  @ManyToOne(() => RoomChat, roomChat => roomChat.participants)
  roomChat: RoomChat;

  @Column({
    type: "enum",
    enum: ParticipantRole,
    default: ParticipantRole.MEMBER
  })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}