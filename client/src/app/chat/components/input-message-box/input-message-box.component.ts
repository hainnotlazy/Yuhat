import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RoomChatDto } from 'src/app/dtos/room-chat.dto';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-input-message-box',
  templateUrl: './input-message-box.component.html',
  styleUrls: ['./input-message-box.component.scss']
})
export class InputMessageBoxComponent {
  @Input() selectedRoomChat!: RoomChatDto;
  messageInput = new FormControl("", [Validators.required]);

  constructor(private chatService: ChatService) {}

  onSendMessage() {
    // FIXME: Fix error when press enter twice
    // FIXME: After send message, it become 1 line chat
    if (this.messageInput.valid && this.messageInput.value?.trim() !== "") {
      this.chatService.sendMessage(this.selectedRoomChat?.id as string, this.messageInput.value as string);
      this.messageInput.reset();
    } else {
      this.messageInput.reset();
    }
  }

  autoGrowInput(element: EventTarget | null) {
    if (!element) return;

    const maxHeight = 120;
    if ((element as HTMLTextAreaElement).scrollHeight <= maxHeight) {
      (element as HTMLTextAreaElement).style.height = ((element as HTMLTextAreaElement).scrollHeight) + 'px';
    } else {
      (element as HTMLTextAreaElement).style.height = maxHeight + 'px';
      (element as HTMLTextAreaElement).style.overflowY = 'auto';
    }
  }
}
