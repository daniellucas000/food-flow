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
  async handleJoinStore(client: Socket, storeId: string) {
    await client.join(`store:${storeId}`);
  }

  @SubscribeMessage('join-order')
  async handleJoinOrder(client: Socket, orderId: string) {
    await client.join(`order:${orderId}`);
  }

  notifyNewOrder(storeId: string, order: unknown) {
    this.server.to(`store:${storeId}`).emit('new-order', order);
  }

  notifyStatusUpdate(orderId: string, status: string) {
    this.server
      .to(`order:${orderId}`)
      .emit('order-status-update', { orderId, status });
  }
}
