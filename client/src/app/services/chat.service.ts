import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
import { Observable, catchError, of, tap } from 'rxjs';
import { IRoomChat } from '../common/models/room-chat.model';
import { IMessage } from '../common/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private socket: Socket,
    private httpClient: HttpClient,
    private snackbar: MatSnackBar
  ) { }

  sendMessage(roomChatId: string, message: string, attachments?: File[]) {
    if (attachments && attachments.length > 0) {
      const attachmentsFile = [];
      for (let attachment of attachments) {
        attachmentsFile.push({
          name: attachment.name,
          buffer: attachment
        })
      }

      this.socket.emit("sendMessage", {
        roomChatId,
        content: message,
        attachments: attachmentsFile
      });
    } else {
      this.socket.emit("sendMessage", {
        roomChatId,
        content: message,
      });
    }
  }

  getNewMessages(): Observable<IMessage> {
    return this.socket.fromEvent<IMessage>("newMessage");
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

  getAllRoomChats(): Observable<IRoomChat[]> {
    return this.httpClient.get<IRoomChat[]>("api/room-chat").pipe(
      catchError(
        error => of([])
      )
    );
  }

  getMessagesByRoomId(roomChatId: string): Observable<IMessage[]> {
    return this.httpClient.get<IMessage[]>(`api/chat/${roomChatId}`).pipe(
      catchError(
        error => of([])
      )
    )
  }
}
