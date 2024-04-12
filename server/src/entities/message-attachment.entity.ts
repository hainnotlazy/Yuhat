import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";

@Entity()
export class MessageAttachment {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Message, message => message.attachments)
  message: Message;

  @Column()
  filePath: string;
}