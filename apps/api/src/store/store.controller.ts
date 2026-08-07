import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get(':slug/menu')
  async getPublicMenu(@Param('slug') slug: string) {
    const store = await this.storeService.store({ slug });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const categories = await this.storeService.findMenuByStoreId(store.id);

    return {
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        isOpen: store.isOpen,
        deliveryFee: store.deliveryFee,
      },
      categories,
    };
  }
}
