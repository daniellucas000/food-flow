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
import { CategoryService } from './category.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { AuthGuard } from '../auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.categoryService.findAllByStore(user.storeId);
  }

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body() body: { name: string; position?: number },
  ) {
    return this.categoryService.create({ ...body, storeId: user.storeId });
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: { name?: string; position?: number; isActive?: boolean },
  ) {
    const category = await this.categoryService.findOne(id);

    if (!category || category.storeId !== user.storeId) {
      throw new ForbiddenException('Category not found in your store');
    }

    return this.categoryService.update(id, body);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const category = await this.categoryService.findOne(id);

    if (!category || category.storeId !== user.storeId) {
      throw new ForbiddenException('Category not found in your store');
    }

    return this.categoryService.remove(id);
  }
}
