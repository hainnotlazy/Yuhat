import { Component, ElementRef,  OnInit,  ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, map, startWith, tap } from 'rxjs';
import { IMessage } from 'src/app/common/models/message.model';
import { IRoomChat } from 'src/app/common/models/room-chat.model';
import { ChatService } from 'src/app/services/chat.service';
import { RoomChatService } from 'src/app/services/room-chat.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentRoomChat?: IRoomChat;
  messages$?: Observable<IMessage[]>;

  @ViewChild("chatView") chatView!: ElementRef;

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
          (roomChat: IRoomChat) => {
            this.currentRoomChat = roomChat;

            this.messages$ = combineLatest([
              this.chatService.getMessagesByRoomId(roomChat.id).pipe(tap(() => this.scrollToBottom())),
              this.chatService.getNewMessages().pipe(startWith(null))
            ]).pipe(
              map(([messages, newMessage]) => {
                if (newMessage && newMessage.roomChat.id === this.currentRoomChat?.id) {
                  messages.push(newMessage);
                  this.scrollToBottom()
                }
                return messages;
              }),
              map(
                messages => messages.map(
                  message => ({
                    ...message,
                    attachments: message.attachments.map(
                      attachment => ({
                        ...attachment,
                        filePath: `${environment.server}/${attachment.filePath}`
                      })
                    )
                  })
                )
              )
            )
          },
          () => this.router.navigate(["/chat"])
        );
      }
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
