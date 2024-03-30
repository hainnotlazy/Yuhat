import { UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';

@WebSocketGateway({ cors: { origin: ["http://localhost:4200"] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  constructor(
    private authService: AuthService
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const user = await this.authService.getUserFromJwtToken(socket.handshake.headers.authorization);
      
      if (!user) {
        this.disconnectSocket(socket);
      }

      socket.emit("message", "connected!!");
    } catch (err) {
      this.disconnectSocket(socket);
    }
  }
  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  // @PublicRoute()
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    
    this.server.emit('message', "hello angular");
  }

  private disconnectSocket(socket: Socket) {
    socket.emit("Error", new UnauthorizedException());
    socket.disconnect()
  }
}
