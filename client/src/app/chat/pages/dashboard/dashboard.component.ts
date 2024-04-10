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
  @ViewChild("liveSearch") liveSearch!: ElementRef;

  searchControl = new FormControl("", [Validators.required]);
  searchedUsers: UserDto[] = [];
  searchInputValue$ = this.searchControl.valueChanges.pipe(
    distinctUntilChanged(),
    switchMap(searchQuery => {
      if (!searchQuery) return of([]);
      return this.usersService.findUsersByNameOrUsername(searchQuery.trim());
    })
  )

  onCreateNewChat(userId: string = "") {
    if (!userId) return;
    this.roomChatService.createNewRoomChat(userId).pipe(
      tap(
        roomChat => {
          this.searchControl.reset();
          this.router.navigate([`/chat/r/${roomChat.id}`]);
        }
      )
    ).subscribe()
  }

  onClick(event: any) {
    let currentTarget = event.target;
    if (["img", "p"].includes(currentTarget["tagName"].toLowerCase())) {
      currentTarget = currentTarget.parentElement;
    }

    if (!currentTarget.classList.contains("live-search")) {
      this.liveSearch.nativeElement.classList.add("hidden");
    } else {
      this.liveSearch.nativeElement.classList.remove("hidden");
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private usersService: UsersService,
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
