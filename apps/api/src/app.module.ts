import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { StoreModule } from './store/store.module';
import { CustomerModule } from './customer/customer.module';
import { CategoryModule } from './category/category.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { OrderService } from './order/order.service';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    StoreModule,
    CustomerModule,
    CategoryModule,
    MenuItemModule,
    OrderModule,
  ],
  providers: [OrderService],
})
export class AppModule {}
