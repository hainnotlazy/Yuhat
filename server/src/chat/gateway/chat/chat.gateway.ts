import { UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';
import { Attachment } from 'src/chat/dtos/attachment.dto';
import { RedisService } from 'src/shared/services/redis/redis.service';

@WebSocketGateway({ 
  cors: { origin: "*" },
  maxHttpBufferSize: 1e9 // ~100MB
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private redisService: RedisService
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const user = await this.authService.getUserFromJwtToken(socket.handshake.headers.authorization);
      if (!user) {
        this.disconnectSocket(socket);
      }

      await this.redisService.setKey(user.id, socket.id);
      socket.data.user = user;

    } catch (err) {
      this.disconnectSocket(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    const userId = socket.data.user.id;
    await this.redisService.removeKey(userId);
    socket.disconnect();
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(socket: Socket, payload: {roomChatId: string, content: string, attachments?: Attachment[]}) {
    const { roomChatId, content, attachments } = payload;
    const user = socket.data.user;
    const { participants, newMessage } = await this.chatService.createNewMessage(user, {roomChatId, content}, attachments);

    for (let participant of participants) {
      const participantId = participant.userId;
      const participantSocketId = await this.redisService.getValue(participantId);

      if (participantSocketId) {
        this.server.to(participantSocketId).emit("newMessage", {
          id: newMessage.id,
          sender: newMessage.sender,
          roomChat: {
            id: roomChatId
          },
          content: newMessage.content,
          createdAt: newMessage.createdAt,
          updatedAt: newMessage.updatedAt,
          attachments: newMessage.attachments,
          sentByCurrentUser: newMessage.sender.id === participantId
        })
      } 
    }
  }

  private disconnectSocket(socket: Socket) {
    socket.emit("Error", new UnauthorizedException());
    socket.disconnect()
  }

  /**
   *     console.log(socket.rooms)

    socket.join("room-test");

    if (socket.rooms.has("room-test")) {
      this.server.to("room-test").emit("test-message", "message only for room test");
    }

    console.log(socket.id); // Log the socket's ID to verify

    // Emitting a message to the socket using its ID
    // socket.emit("test-message", "welcome");

    // Alternatively, you can use the server object to emit to a specific socket
    this.server.to(socket.id).emit("test-message", "welcome");

    // console.log(client.conn.id);
    // client.to(client.conn.id).emit("test-message", "welcome");
    // this.server.to(client.conn.id).emit("test-message", "welcome");
    this.server.emit('test-message', "hello angular");
   */
}
