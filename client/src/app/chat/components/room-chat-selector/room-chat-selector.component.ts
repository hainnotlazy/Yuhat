import { Component, Input } from '@angular/core';
import { RoomChatDto } from 'src/app/dtos/room-chat.dto';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-room-chat-selector',
  templateUrl: './room-chat-selector.component.html',
  styleUrls: ['./room-chat-selector.component.scss']
})
export class RoomChatSelectorComponent {
  roomChats$ = this.chatService.getAllRoomChats();

  @Input() selectedRoomChat?: RoomChatDto;

  constructor(
    private chatService: ChatService
  ) {}

  // selectChat(roomChat: RoomChatDto) {
  //   // this.selectedRoomChat = roomChat;

  //   this.selectRoomChat.emit(roomChat);
  // }
}
