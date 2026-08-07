import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { AuthGuard } from '../auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.menuItemService.findAllByStore(user.storeId);
  }

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
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
    },
  ) {
    return this.menuItemService.create({ ...body, storeId: user.storeId });
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      price?: number;
      isAvailable?: boolean;
      imageUrl?: string;
    },
  ) {
    const item = await this.menuItemService.findOne(id);

    if (!item || item.storeId !== user.storeId) {
      throw new ForbiddenException('Item not found in your store');
    }

    return this.menuItemService.update(id, body);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const item = await this.menuItemService.findOne(id);

    if (!item || item.storeId !== user.storeId) {
      throw new ForbiddenException('Item not found in your store');
    }

    return this.menuItemService.remove(id);
  }
}
