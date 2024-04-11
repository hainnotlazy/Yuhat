import { Component, ElementRef,  OnInit,  ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, debounceTime, distinctUntilChanged, map, of, startWith, switchMap, tap } from 'rxjs';
import { MessageDto } from 'src/app/dtos/message.dto';
import { RoomChatDto } from 'src/app/dtos/room-chat.dto';
import { UserDto } from 'src/app/dtos/user.dto';
import { ChatService } from 'src/app/services/chat.service';
import { RoomChatService } from 'src/app/services/room-chat.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentRoomChat?: RoomChatDto;
  messages$?: Observable<MessageDto[]>;

  @ViewChild("chatView") chatView!: ElementRef;
  @ViewChild("roomChatInfoSidebar") roomChatInfoSidebarRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private roomChatService: RoomChatService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        const roomChatId = params["roomChatId"];

        this.roomChatService.findRoomChatById(roomChatId).subscribe(
          (roomChat: RoomChatDto) => {
            this.currentRoomChat = roomChat;

            this.messages$ = combineLatest([
              this.chatService.getMessagesByRoomId(roomChat.id).pipe(tap(() => this.scrollToBottom())),
              this.chatService.getNewMessages().pipe(startWith(null))
            ]).pipe(
              map(([messages, newMessage]) => {
                if (newMessage && newMessage.roomChatId === this.currentRoomChat?.id) {
                  messages.push(newMessage);
                  this.scrollToBottom()
                }
                return messages;
              })
            )
          },
          () => this.router.navigate(["/chat"])
        );
      }
    )
  }

  onViewRoomChatInfo() {
    const classes = this.roomChatInfoSidebarRef.nativeElement.classList;
    if (classes.contains("hide")) {
      this.roomChatInfoSidebarRef.nativeElement.classList.remove("hide");
    } else {
      this.roomChatInfoSidebarRef.nativeElement.classList.add("hide");
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
