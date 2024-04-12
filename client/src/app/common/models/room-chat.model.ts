import { IMessage } from "./message.model";
import { IUser } from "./user.model";

export interface IRoomChat {
  id: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;

  participants: IRoomChatParticipant[];
  messages: IMessage[];
}

export interface IRoomChatParticipant {
  role: string;
  user: Partial<IUser>
}
