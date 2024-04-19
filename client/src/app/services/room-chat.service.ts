import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IRoomChat } from '../common/models/room-chat.model';
import { IUser } from '../common/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class RoomChatService {
  constructor(
    private httpClient: HttpClient,
    private snackbar: MatSnackBar,
  ) { }

  findRoomChatById(id: string) {
    return this.httpClient.get<IRoomChat>(`api/room-chat/${id}`).pipe(
      map(
        data => ({
          ...data,
          avatar: `${environment.server}/${data.avatar}`,
          participants: data.participants.map(participant => ({
            ...participant,
            user: {
              ...participant.user,
              avatar: `${environment.server}/${participant.user.avatar}`
            }
          }))
        })
      )
    )
  }

  createNewRoomChat(receiverId: string) {
    return this.httpClient.post<IRoomChat>("api/room-chat/personal-chat", {
      userId: receiverId
    });
  }

  createNewGroupChat(members: IUser[], roomChatName: string, avatar: string) {
    const formData = new FormData();

    formData.append("roomChatName", roomChatName);
    formData.append("avatar", avatar);
    members.forEach(member => {
      formData.append("userId", member.id);
    });

    return this.httpClient.post<IRoomChat>("api/room-chat/group-chat", formData).pipe(
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
}
