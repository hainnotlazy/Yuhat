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
  @ViewChild("roomChatInfoSidebar") roomChatInfoSidebarRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.chatService.getNewMessages().subscribe();
  }

  onViewRoomChatInfo() {
    const classes = this.roomChatInfoSidebarRef.nativeElement.classList;
    if (classes.contains("hide")) {
      this.roomChatInfoSidebarRef.nativeElement.classList.remove("hide");
    } else {
      this.roomChatInfoSidebarRef.nativeElement.classList.add("hide");
    }
  }

  onSelectedRoomChat(roomChatId: RoomChatDto) {
    this.selectedRoomChat = roomChatId;

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

  private scrollToBottom() {
    try {
      setTimeout(() => {
        this.chatView.nativeElement.scrollTop = this.chatView.nativeElement.scrollHeight
      }, 1);
    } catch(err) { }
  }
}
