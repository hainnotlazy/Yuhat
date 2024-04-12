import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { RoomChat } from "./room-chat.entity";
import { MessageAttachment } from "./message-attachment.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, user => user.messages)
  sender: User;

  @ManyToOne(() => RoomChat, roomChat => roomChat.messages)
  room: RoomChat;

  @OneToMany(() => MessageAttachment, attachment => attachment.message)
  attachments: MessageAttachment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}