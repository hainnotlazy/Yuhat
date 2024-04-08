export interface MessageDto {
  content: string;
  sentAt: Date;
  sender: string;
  senderAvatar: string;
  sentByCurrentUser: boolean;
}
