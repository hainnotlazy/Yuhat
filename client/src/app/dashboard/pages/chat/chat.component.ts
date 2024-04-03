import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  constructor(private chatService: ChatService) {}

  formCreateNewChat = new FormGroup({
    userId: new FormControl("", [
      Validators.required
    ])
  })

  onCreateNewChat() {
    if (this.formCreateNewChat.valid) {
      this.chatService.createNewRoomChat(this.formCreateNewChat.controls.userId?.value as string).subscribe();
      // this.chatService.createNewRoomChat(this.formCreateNewChat.get("userId")?.value as string).subscribe();
    }
  }
}
