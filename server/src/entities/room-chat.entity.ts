import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomChatParticipant } from "./room-chat-participant.entity";

enum RoomChatType {
  "PERSONAL" = "personal",
  "GROUP" = "group",
  "BOT" = "bot",
}

@Entity()
export class RoomChat {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: RoomChatType,
    default: RoomChatType.PERSONAL
  })
  type: string;

  @OneToMany(() => RoomChatParticipant, participant => participant.roomChat)
  participants: RoomChatParticipant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}