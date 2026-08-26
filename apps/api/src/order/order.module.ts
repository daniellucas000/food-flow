import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrdersGateway } from './order.gateway';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [PrismaModule, WhatsappModule],
  controllers: [OrderController],
  providers: [OrderService, OrdersGateway],
})
export class OrderModule {}
