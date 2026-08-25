import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

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
        logoUrl: store.logoUrl,
        bannerUrl: store.bannerUrl,
      },
      categories,
    };
  }

  @HttpCode(200)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Patch('me')
  updateMyStore(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      name?: string;
      phone?: string;
      whatsappNumber?: string;
      logoUrl?: string;
      bannerUrl?: string;
      isOpen?: boolean;
    },
  ) {
    return this.storeService.updateStore(user.storeId, body);
  }
}
