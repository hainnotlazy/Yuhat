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
  @PrimaryColumn("uuid")
  userId: string;

  @PrimaryColumn("uuid")
  roomChatId: string;

  @ManyToOne(() => User, user => user.participants)
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