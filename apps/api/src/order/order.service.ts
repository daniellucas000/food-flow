import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '../generated/prisma/enums';
import { OrdersGateway } from './order.gateway';
import { WhatsappService } from '../whatsapp/whatsapp.service';

interface CreateOrderInput {
  storeId: string;
  customerId: string;
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
}

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private ordersGateway: OrdersGateway,
    private whatsappService: WhatsappService,
  ) {}

  async create(data: CreateOrderInput) {
    const subtotal = data.items.reduce((sum, item) => {
      const optionsTotal = item.selectedOptions.reduce(
        (s, o) => s + o.priceModifier,
        0,
      );
      return sum + (item.unitPrice + optionsTotal) * item.quantity;
    }, 0);

    const total = subtotal + data.deliveryFee;

    const order = await this.prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: {
          customerId: data.customerId,
          street: data.address.street,
          number: data.address.number,
          complement: data.address.complement,
          neighborhood: data.address.neighborhood,
          city: data.address.city,
          state: data.address.state,
          zipCode: data.address.zipCode,
        },
      });

      return tx.order.create({
        data: {
          storeId: data.storeId,
          customerId: data.customerId,
          addressId: address.id,
          deliveryType: data.deliveryType,
          paymentMethod: data.paymentMethod,
          subtotal,
          deliveryFee: data.deliveryFee,
          total,
          notes: data.notes,
          items: {
            create: data.items.map((item) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              selectedOptions: {
                create: item.selectedOptions.map((option) => ({
                  itemOptionId: option.itemOptionId,
                  priceModifier: option.priceModifier,
                })),
              },
            })),
          },
          statusHistory: {
            create: { status: 'RECEIVED' },
          },
        },
        include: { items: true, address: true },
      });
    });

    this.ordersGateway.notifyNewOrder(order.storeId, order);

    const store = await this.prisma.store.findUnique({
      where: { id: order.storeId },
    });
    if (store?.whatsappNumber) {
      void this.whatsappService.sendMessage(
        store.whatsappNumber,
        `🔔 Novo pedido recebido!\n\nTotal: R$ ${order.total.toFixed(2)}\nTipo: ${order.deliveryType === 'DELIVERY' ? 'Entrega' : 'Retirada'}`,
      );
    }

    return order;
  }

  async findByCustomer(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true, address: true },
    });
  }

  async findByStore(storeId: string) {
    return this.prisma.order.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      include: { items: true, address: true, customer: true },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: { status },
      });

      await tx.orderStatusHistory.create({
        data: { orderId: id, status },
      });

      return order;
    });
  }
}
