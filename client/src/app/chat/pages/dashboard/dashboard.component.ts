import { Component, ElementRef,  ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { MessageDto } from 'src/app/dtos/message.dto';
import { RoomChatDto } from 'src/app/dtos/room-chat.dto';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  selectedRoomChat: RoomChatDto | null = null;
  roomChats$ = this.chatService.getAllRoomChats();
  messages$: Observable<MessageDto[]> | null = null;

  @ViewChild("chatView") chatView!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

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

  onSelectedRoomChat(roomChatId: RoomChatDto) {
    this.selectedRoomChat = roomChatId;
    this.messages$ = this.chatService.getMessagesByRoomId(this.selectedRoomChat.id).pipe(
      tap(
        () => this.scrollToBottom()
      )
    )
  }

  private scrollToBottom() {
    try {
      setTimeout(() => {
        this.chatView.nativeElement.scrollTop = this.chatView.nativeElement.scrollHeight
      }, 1);
    } catch(err) { }
  }
}
