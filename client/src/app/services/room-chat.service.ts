import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IRoomChat } from '../common/models/room-chat.model';

@Injectable({
  providedIn: 'root'
})
export class RoomChatService {
  constructor(
    private httpClient: HttpClient,
  ) { }

  findRoomChatById(id: string) {
    return this.httpClient.get<IRoomChat>(`api/room-chat/${id}`).pipe(
      map(
        data => ({
          ...data,
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
}
