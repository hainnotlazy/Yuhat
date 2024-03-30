import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }

  sendMessage(message: string) {
    this.socket.emit("message", message);
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
}
