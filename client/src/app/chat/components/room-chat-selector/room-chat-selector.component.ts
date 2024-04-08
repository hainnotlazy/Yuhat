import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RoomChatDto } from 'src/app/dtos/room-chat.dto';

@Component({
  selector: 'app-room-chat-selector',
  templateUrl: './room-chat-selector.component.html',
  styleUrls: ['./room-chat-selector.component.scss']
})
export class RoomChatSelectorComponent {
  @Input() roomChats: RoomChatDto[] | null = null;
  // @Input() selectedRoomChat;
  @Output() selectRoomChat = new EventEmitter<RoomChatDto>();

  constructor(private router: Router) {}

  selectChat(roomChat: RoomChatDto) {
    // this.router.navigate([`/chat/r/${roomChat.id}`])
    this.selectRoomChat.emit(roomChat);
  }
}
