import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class OrdersGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('join-store')
  handleJoinStore(client: Socket, storeId: string) {
    void client.join(`store:${storeId}`);
  }

  notifyNewOrder(storeId: string, order: unknown) {
    this.server.to(`store:${storeId}`).emit('new-order', order);
  }
}
