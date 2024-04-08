import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoomChatDto } from 'src/app/dtos/room-chat.dto';

@Component({
  selector: 'app-room-chat-selector',
  templateUrl: './room-chat-selector.component.html',
  styleUrls: ['./room-chat-selector.component.scss']
})
export class RoomChatSelectorComponent {
  @Input() roomChats: RoomChatDto[] | null = null;
  @Output() selectedRoomChat = new EventEmitter<RoomChatDto>();

  selectChat(roomChatId: RoomChatDto) {
    this.selectedRoomChat.emit(roomChatId);
  }
}
