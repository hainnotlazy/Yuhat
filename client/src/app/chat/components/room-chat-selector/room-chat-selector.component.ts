import { Component, Input } from '@angular/core';
import { combineLatest, map, startWith } from 'rxjs';
import { RoomChatDto } from 'src/app/dtos/room-chat.dto';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-room-chat-selector',
  templateUrl: './room-chat-selector.component.html',
  styleUrls: ['./room-chat-selector.component.scss']
})
export class RoomChatSelectorComponent {
  roomChats$ = combineLatest([
    this.chatService.getAllRoomChats(),
    this.chatService.getNewMessages().pipe(startWith(null))
  ]).pipe(
    map(([roomChats, newMessage]) => {
      if (newMessage) {
        roomChats.forEach(roomChat => {
          if (roomChat.id === newMessage.roomChatId) {
            roomChat.latestMessage = newMessage.content;
            roomChat.latestMessageSentAt = newMessage.sentAt;
          }
        })
        roomChats.sort((a, b) => {
          return new Date(b.latestMessageSentAt).getTime() - new Date(a.latestMessageSentAt).getTime();
        });
      }
      return roomChats;
    })
  );

  @Input() selectedRoomChat?: RoomChatDto;

  constructor(
    private chatService: ChatService
  ) {}

}
