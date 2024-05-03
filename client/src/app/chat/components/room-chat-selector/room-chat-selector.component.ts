import { Component, Input } from '@angular/core';
import { combineLatest, map, startWith, tap } from 'rxjs';
import { IRoomChat, IRoomChatParticipant } from 'src/app/common/models/room-chat.model';
import { ChatService } from 'src/app/services/chat.service';
import { RoomChatService } from 'src/app/services/room-chat.service';

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
        // Handle if new msg is from selectedRoomChat
        if (
          !roomChats.find(roomChat => roomChat.id === newMessage.roomChat.id)
          && newMessage.roomChat.id === this.selectedRoomChat?.id
        ) {
          roomChats.push({
            id: this.selectedRoomChat?.id as string,
            name: this.selectedRoomChat?.name as string,
            avatar: this.selectedRoomChat?.avatar as string,
            type: this.selectedRoomChat?.type as string,
            participants: this.selectedRoomChat?.participants as IRoomChatParticipant[],
            messages: [newMessage]
          })
        }
        // Handle if new msg not in roomChats & selectedRoomChat
        else if (!roomChats.find(roomChat => roomChat.id === newMessage.roomChat.id)) {
          const roomChatId = newMessage.roomChat.id;

          this.roomChatService.findRoomChatById(roomChatId as string).pipe(
            tap(
              data => {
                roomChats.push({
                  id: roomChatId as string,
                  name: data.name,
                  avatar: data.avatar,
                  type: data.type,
                  participants: data.participants,
                  messages: [newMessage]
                })
              }
            ),
            tap(
              () => {
                roomChats.sort((a, b) => {
                  return new Date(b.messages[0].createdAt).getTime() - new Date(a.messages[0].createdAt).getTime();
                });
              }
            )
          ).subscribe();
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
    private chatService: ChatService,
    private roomChatService: RoomChatService
  ) {}

}
