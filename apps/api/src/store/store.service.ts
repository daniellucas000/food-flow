import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Store } from '../generated/prisma/client';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async store(where: Prisma.StoreWhereUniqueInput): Promise<Store | null> {
    return this.prisma.store.findUnique({ where });
  }
}
