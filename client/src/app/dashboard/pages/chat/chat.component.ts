import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { IMessage } from '../../dtos/message.dto';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  roomChats$ = this.chatService.getAllRoomChats();
  messages: IMessage[] = [];
  currentRoom: string | null = null;

  constructor(
    private chatService: ChatService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.chatService.getNewMessages().pipe(
      map(
        (data: any) => {
          if (data.roomChatId === this.currentRoom) {
            this.messages.push({
              sender_avatar: data.sender_avatar,
              content: data.content,
              time: data.sentAt
            });
            this.messageForSending.reset();
          }
        }
      )
    ).subscribe();
  }

  onSelectRoomChat(roomId: string = "") {
    if (roomId) {
      this.currentRoom = roomId;
      this.httpClient.get<IMessage[]>(`api/chat/${this.currentRoom}`).subscribe(
        data => this.messages = data
      );
    }
  }

  autoGrowInput(element: any) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
  }

  // Create new Room Chat
  formCreateNewChat = new FormGroup({
    userId: new FormControl("", [
      Validators.required
    ])
  })

  // Send message
  messageForSending = new FormControl("", [Validators.required]);

  onCreateNewChat() {
    if (this.formCreateNewChat.valid) {
      this.chatService.createNewRoomChat(this.formCreateNewChat.controls.userId?.value as string).subscribe();
    }
  }

  sendMessage() {
    this.chatService.sendMessage(this.currentRoom as string, this.messageForSending.value as string);
  }
}
