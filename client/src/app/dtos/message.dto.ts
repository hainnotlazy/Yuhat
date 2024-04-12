export interface IMessage {
  content: string;
  createdAt: Date;
  updatedAt: Date;
  sender: any;
  attachments: IAttachment[];
  sentByCurrentUser: boolean;
}

export interface IAttachment {
  filePath: string;
}
