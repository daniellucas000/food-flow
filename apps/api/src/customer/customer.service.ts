import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Customer, Prisma } from '../generated/prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async customer(
    where: Prisma.CustomerWhereUniqueInput,
  ): Promise<Customer | null> {
    return this.prisma.customer.findUnique({ where });
  }

  async findByEmail(storeId: string, email: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { storeId_email: { storeId, email } },
    });
  }

  async findByPhone(storeId: string, phone: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { storeId_phone: { storeId, phone } },
    });
  }

  async createCustomer(data: {
    name: string;
    phone: string;
    storeId: string;
    email?: string;
    password?: string | null;
  }): Promise<Customer> {
    return this.prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone,
        storeId: data.storeId,
        email: data.email,
        password: data.password,
      },
    });
  }
}
