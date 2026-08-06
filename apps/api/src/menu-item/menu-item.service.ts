import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MenuItem, Prisma } from '../generated/prisma/client';

interface CreateMenuItemInput {
  storeId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  optionGroups?: {
    name: string;
    minSelect?: number;
    maxSelect?: number;
    required?: boolean;
    options: { name: string; priceModifier?: number }[];
  }[];
}

@Injectable()
export class MenuItemService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByStore(storeId: string) {
    return this.prisma.menuItem.findMany({
      where: { storeId },
      include: {
        category: true,
        optionGroups: { include: { options: true } },
      },
      orderBy: { position: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.menuItem.findUnique({
      where: { id },
      include: { optionGroups: { include: { options: true } } },
    });
  }

  async create(data: CreateMenuItemInput): Promise<MenuItem> {
    const createInput: Prisma.MenuItemCreateInput = {
      store: { connect: { id: data.storeId } },
      category: { connect: { id: data.categoryId } },
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      optionGroups: data.optionGroups
        ? {
            create: data.optionGroups.map((group) => ({
              name: group.name,
              minSelect: group.minSelect ?? 0,
              maxSelect: group.maxSelect ?? 1,
              required: group.required ?? false,
              options: {
                create: group.options.map((option) => ({
                  name: option.name,
                  priceModifier: option.priceModifier ?? 0,
                })),
              },
            })),
          }
        : undefined,
    };

    return this.prisma.menuItem.create({ data: createInput });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      isAvailable?: boolean;
      imageUrl?: string;
    },
  ): Promise<MenuItem> {
    return this.prisma.menuItem.update({ where: { id }, data });
  }

  async remove(id: string): Promise<MenuItem> {
    return this.prisma.menuItem.delete({ where: { id } });
  }
}
