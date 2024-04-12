import { Component, Input } from '@angular/core';
import { combineLatest, map, startWith } from 'rxjs';
import { IRoomChat, IRoomChatParticipant } from 'src/app/common/models/room-chat.model';
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
        // Handle if new msg is the first msg of roomChat
        if (
          !roomChats.find(roomChat => roomChat.id === newMessage.roomChat.id)
          && newMessage.roomChat.id === this.selectedRoomChat?.id
        ) {
          roomChats.push({
            id: this.selectedRoomChat?.id as string,
            type: this.selectedRoomChat?.type as string,
            participants: this.selectedRoomChat?.participants as IRoomChatParticipant[],
            messages: [newMessage]
          })
        }
        // Handle if new msg belong to room in roomChats
        else {
          roomChats.forEach(roomChat => {
            if (roomChat.id === newMessage.roomChat.id) {
              roomChat.messages = [newMessage];
            }
          })
        }

        roomChats.sort((a, b) => {
          return new Date(b.messages[0].createdAt).getTime() - new Date(a.messages[0].createdAt).getTime();
        });
      }

      return roomChats;
    })
  );

  @Input() selectedRoomChat?: IRoomChat;

  constructor(
    private chatService: ChatService
  ) {}

}
