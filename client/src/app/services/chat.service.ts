import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
import { catchError, map, tap } from 'rxjs';
import { RoomChatDto } from '../dashboard/dtos/room-chat.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private socket: Socket,
    private httpClient: HttpClient,
    private snackbar: MatSnackBar
  ) { }

  sendMessage(roomChatId: string, message: string) {
    this.socket.emit("sendMessage", {
      roomChatId,
      content: message
    });
  }

  getMessage() {
    return this.socket.fromEvent("message").pipe(
      map(
        (data: any) => {
          console.log(data);
          return data;
        }
      )
    )
  }

  getNewMessages() {
    return this.socket.fromEvent("newMessage");
  }

  createNewRoomChat(userId: string) {
    return this.httpClient.post("api/room-chat/personal-chat", {
      userId
    }).pipe(
      tap(
        () => this.snackbar.open("Created new room chat", "x", {
          duration: 2000,
          horizontalPosition: "right",
          verticalPosition: "top"
        })
      ),
      catchError(
        err => {
          this.snackbar.open("Unexpected error happened", "x", {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top"
        })
        throw new Error("");
      })
    )
  }

  getAllRoomChats() {
    return this.httpClient.get<RoomChatDto[]>("api/room-chat");
  }
}
