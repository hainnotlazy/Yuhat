export interface RoomChatDto {
  id: string;
  type: string;
  latestMessage: string;
  latestMessageSentAt: Date;
  participantId?: string;
  participantName: string;
  participantAvatar: string;
}

export interface CreatedRoomChatDto {
  id: string;
  type: string;
}
