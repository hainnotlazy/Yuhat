export interface MessageDto {
  roomChatId?: string;
  content: string;
  sentAt: Date;
  sender: string;
  senderAvatar: string;
  sentByCurrentUser: boolean;
}
