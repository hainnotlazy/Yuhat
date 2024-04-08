export interface MessageDto {
  content: string;
  sentAt: Date;
  senderAvatar: string;
  sentByCurrentUser: boolean;
}
