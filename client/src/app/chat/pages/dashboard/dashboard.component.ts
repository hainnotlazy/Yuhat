import { Component, ElementRef,  ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, map, startWith, tap } from 'rxjs';
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

  messages: any;

  messageInput = new FormControl("", [Validators.required]);

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.chatService.getNewMessages().subscribe();
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

  some() {

  }

  onSelectedRoomChat(roomChatId: RoomChatDto) {
    this.selectedRoomChat = roomChatId;
    // this.messages$ = this.chatService.getMessagesByRoomId(this.selectedRoomChat.id).pipe(
    //   tap(
    //     () => this.scrollToBottom()
    //   )
    // )

    this.messages$ = combineLatest([
      this.chatService.getMessagesByRoomId(this.selectedRoomChat.id).pipe(tap(() => this.scrollToBottom())),
      this.chatService.getNewMessages().pipe(startWith(null))
    ]).pipe(
      map(([messages, newMessage]) => {
        if (newMessage && newMessage.roomChatId === this.selectedRoomChat?.id) {
          messages.push(newMessage);
          this.scrollToBottom()
        }
        return messages;
      })
    )
  }

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

  private scrollToBottom() {
    try {
      setTimeout(() => {
        this.chatView.nativeElement.scrollTop = this.chatView.nativeElement.scrollHeight
      }, 1);
    } catch(err) { }
  }
}
