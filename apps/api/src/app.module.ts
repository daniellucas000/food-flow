import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { StoreService } from './store/store.service';
import { StoreModule } from './store/store.module';
import { CustomerService } from './customer/customer.service';
import { CustomerModule } from './customer/customer.module';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { MenuItemController } from './menu-item/menu-item.controller';
import { MenuItemModule } from './menu-item/menu-item.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    StoreModule,
    CustomerModule,
    CategoryModule,
    MenuItemModule,
  ],
  providers: [StoreService, CustomerService, CategoryService],
  controllers: [MenuItemController],
})
export class AppModule {}
