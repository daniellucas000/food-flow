import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '../generated/prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByStore(storeId: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { storeId },
      orderBy: { position: 'asc' },
    });
  }

  async findOne(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async create(data: {
    name: string;
    position?: number;
    storeId: string;
  }): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async update(
    id: string,
    data: { name?: string; position?: number; isActive?: boolean },
  ): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }
}
