import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { MessageDto } from '../../dtos/message.dto';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  roomChats$ = this.chatService.getAllRoomChats();
  messages: MessageDto[] = [];
  currentRoom: string | null = null;

  testMessages: string[] = [];

  constructor(
    private chatService: ChatService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.chatService.getTestMessage().subscribe(
      data => this.testMessages.push(data)
    )
  }

  onSelectRoomChat(roomId: string = "") {
    if (roomId) {
      this.currentRoom = roomId;
      this.httpClient.get<MessageDto[]>(`api/chat/${this.currentRoom}`).subscribe(
        data => this.messages = data
      );
    }
  }

  formCreateNewChat = new FormGroup({
    userId: new FormControl("", [
      Validators.required
    ])
  })

  messageForSending = new FormControl("", [Validators.required]);

  onCreateNewChat() {
    if (this.formCreateNewChat.valid) {
      this.chatService.createNewRoomChat(this.formCreateNewChat.controls.userId?.value as string).subscribe();
    }
  }

  sendMessage() {
    this.chatService.sendMessage(this.messageForSending.value as string);
  }

}
