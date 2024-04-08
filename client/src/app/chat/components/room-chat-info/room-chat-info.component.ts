import { Component, ElementRef, Input } from '@angular/core';
import { RoomChatDto } from 'src/app/dtos/room-chat.dto';

@Component({
  selector: 'app-room-chat-info',
  templateUrl: './room-chat-info.component.html',
  styleUrls: ['./room-chat-info.component.scss']
})
export class RoomChatInfoComponent {
  @Input() selectedRoomChat!: RoomChatDto;
  @Input() roomChatInfoSidebarRef!: ElementRef;

  onViewRoomChatInfo() {
    const classes = this.roomChatInfoSidebarRef.nativeElement.classList;
    if (classes.contains("hide")) {
      this.roomChatInfoSidebarRef.nativeElement.classList.remove("hide");
    } else {
      this.roomChatInfoSidebarRef.nativeElement.classList.add("hide");
    }
  }
}
