import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrdersGateway } from './order.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [OrderService, OrdersGateway],
})
export class OrderModule {}
