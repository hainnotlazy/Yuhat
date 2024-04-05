import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { RoomChat } from "./room-chat.entity";

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}