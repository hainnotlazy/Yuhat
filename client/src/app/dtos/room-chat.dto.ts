export interface RoomChatDto {
  id: string;
  type: string;
  latestMessage: string;
  latestMessageSentAt: Date;
  participantName: string;
  participantAvatar: string;
}
