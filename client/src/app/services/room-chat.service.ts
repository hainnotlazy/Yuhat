import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatedRoomChatDto, RoomChatDto } from '../dtos/room-chat.dto';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RoomChatService {
  constructor(
    private httpClient: HttpClient,
  ) { }

  findRoomChatById(id: string) {
    return this.httpClient.get<RoomChatDto>(`api/room-chat/${id}`).pipe(
      map(
        data => ({
          ...data,
          participantAvatar: `${environment.server}/${data.participantAvatar}`
        })
      )
    )
  }

  createNewRoomChat(receiverId: string) {
    return this.httpClient.post<CreatedRoomChatDto>("api/room-chat/personal-chat", {
      userId: receiverId
    });
  }
}
