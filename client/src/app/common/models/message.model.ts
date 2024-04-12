import { IRoomChat } from "./room-chat.model";
import { IUser } from "./user.model";

export interface IMessage {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  sender: Partial<IUser>;
  roomChat: Partial<IRoomChat>;
  attachments: IMessageAttachment[];
  sentByCurrentUser: boolean;
}

export interface IMessageAttachment {
  filePath: string;
}
