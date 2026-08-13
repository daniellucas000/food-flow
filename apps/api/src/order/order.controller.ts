import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { OrderStatus } from '../generated/prisma/enums';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @HttpCode(201)
  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      deliveryType: 'DELIVERY' | 'PICKUP';
      paymentMethod: 'ONLINE' | 'CASH_ON_DELIVERY';
      address: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
      };
      items: {
        menuItemId: string;
        quantity: number;
        unitPrice: number;
        selectedOptions: { itemOptionId: string; priceModifier: number }[];
      }[];
      deliveryFee: number;
      notes?: string;
    },
  ) {
    if (user.type !== 'customer') {
      throw new ForbiddenException('Only customers can place orders');
    }

    return this.orderService.create({
      storeId: user.storeId,
      customerId: user.sub,
      ...body,
    });
  }

  @Get(':id')
  async findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const order = await this.orderService.findById(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const isOwner = user.type === 'customer' && order.customerId === user.sub;
    const isStoreStaff = user.type === 'user' && order.storeId === user.storeId;

    if (!isOwner && !isStoreStaff) {
      throw new ForbiddenException('You cannot view this order');
    }

    return order;
  }

  @Get('mine')
  findMine(@CurrentUser() user: JwtPayload) {
    if (user.type !== 'customer') {
      throw new ForbiddenException('Only customers can view their orders');
    }
    return this.orderService.findByCustomer(user.sub);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    if (user.type !== 'user') {
      throw new ForbiddenException('Only staff can view store orders');
    }
    return this.orderService.findByStore(user.storeId);
  }

  @HttpCode(200)
  @Patch(':id/status')
  async updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: { status: OrderStatus },
  ) {
    if (user.type !== 'user') {
      throw new ForbiddenException('Only staff can update order status');
    }

    const order = await this.orderService.findById(id);
    if (!order || order.storeId !== user.storeId) {
      throw new NotFoundException('Order not found in your store');
    }

    return this.orderService.updateStatus(id, body.status);
  }
}
