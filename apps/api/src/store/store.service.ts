import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Store } from '../generated/prisma/client';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async store(where: Prisma.StoreWhereUniqueInput): Promise<Store | null> {
    return this.prisma.store.findUnique({ where });
  }

  async findMenuByStoreId(storeId: string) {
    return this.prisma.category.findMany({
      where: { storeId, isActive: true },
      orderBy: { position: 'asc' },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { position: 'asc' },
          include: {
            optionGroups: {
              include: { options: true },
            },
          },
        },
      },
    });
  }

  async updateStore(
    storeId: string,
    data: {
      name?: string;
      phone?: string;
      whatsappNumber?: string;
      logoUrl?: string;
      bannerUrl?: string;
      isOpen?: boolean;
    },
  ): Promise<Store> {
    return this.prisma.store.update({
      where: { id: storeId },
      data,
    });
  }
}
