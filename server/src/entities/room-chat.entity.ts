import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomChatParticipant } from "./room-chat-participant.entity";
import { Message } from "./message.entity";

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

  @Column({ nullable: true, length: 255 })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => RoomChatParticipant, participants => participants.roomChat)
  participants: RoomChatParticipant[];

  @OneToMany(() => Message, messages => messages.room)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}