import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IRoomChat } from 'src/app/common/models/room-chat.model';

@Component({
  selector: 'app-room-chat-info',
  templateUrl: './room-chat-info.component.html',
  styleUrls: ['./room-chat-info.component.scss']
})
export class RoomChatInfoComponent {
  @Input() selectedRoomChat!: IRoomChat;

  @ViewChild("roomChatInfoSidebar") roomChatInfoSidebarRef!: ElementRef;

  onViewRoomChatInfo() {
    const classes = this.roomChatInfoSidebarRef.nativeElement.classList;
    if (classes.contains("hide")) {
      this.roomChatInfoSidebarRef.nativeElement.classList.remove("hide");
    } else {
      this.roomChatInfoSidebarRef.nativeElement.classList.add("hide");
    }
  }
}
