import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { RoomChatDto } from '../dtos/room-chat.dto';
import { environment } from 'src/environments/environment.development';
import { IMessage } from '../dtos/message.dto';

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

  getNewMessages(): Observable<IMessage> {
    return this.socket.fromEvent<IMessage>("newMessage").pipe(
      map(
        message => ({
          ...message,
          sender: {
            avatar: `${environment.server}/${message.sender.avatar}`
          }
        })
      )
    );
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

  getAllRoomChats(): Observable<RoomChatDto[]> {
    return this.httpClient.get<RoomChatDto[]>("api/room-chat").pipe(
      map(
        response => {
          return response.map(
            roomChat => ({
              ...roomChat,
              participantAvatar: `${environment.server}/${roomChat.participantAvatar}`
            })
          )
        }
      ),
      catchError(
        error => of([])
      )
    );
  }

  getMessagesByRoomId(roomChatId: string): Observable<IMessage[]> {
    return this.httpClient.get<IMessage[]>(`api/chat/${roomChatId}`).pipe(
      map(
        response => {
          return response.map(
            message => ({
              ...message,
              sender: {
                avatar: `${environment.server}/${message.sender.avatar}`
              }
            })
          )
        }
      ),
      catchError(
        error => of([])
      )
    )
  }
}
