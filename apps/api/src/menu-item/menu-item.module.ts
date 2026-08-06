import { Module } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MenuItemController } from './menu-item.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MenuItemController],
  providers: [MenuItemService],
})
export class MenuItemModule {}
