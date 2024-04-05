import { InjectRedis } from '@nestjs-modules/ioredis';
import { UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Redis } from 'ioredis';
import { timer } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';

@WebSocketGateway({ cors: { origin: ["http://localhost:4200"] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    @InjectRedis() private redis: Redis
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const user = await this.authService.getUserFromJwtToken(socket.handshake.headers.authorization);
      
      if (!user) {
        this.disconnectSocket(socket);
      }

      socket.data.user = user;
      timer(0, 1000).subscribe(
        () => this.server.emit('message', "hello angular")
      )
      socket.emit("message", "connected!!");
    } catch (err) {
      this.disconnectSocket(socket);
    }
  }
  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    this.server.emit('message', "hello angular")
  }

  @SubscribeMessage('sendMessage')
  sendMessage(client: Socket, payload: any) {
    this.redis.set("first value", "hello redis 1");

    // console.log(client.rooms)

    // client.join("room-test");

    // if (client.rooms.has("room-test")) {
    //   this.server.to("room-test").emit("test-message", "message only for room test");
    // }

    // console.log(client.id); // Log the client's ID to verify

    // // Emitting a message to the client using its ID
    // // client.emit("test-message", "welcome");

    // // Alternatively, you can use the server object to emit to a specific client
    // this.server.to(client.id).emit("test-message", "welcome");

    // // console.log(client.conn.id);
    // // client.to(client.conn.id).emit("test-message", "welcome");
    // // this.server.to(client.conn.id).emit("test-message", "welcome");
    // this.server.emit('test-message', "hello angular");
  }



  private disconnectSocket(socket: Socket) {
    socket.emit("Error", new UnauthorizedException());
    socket.disconnect()
  }
}
