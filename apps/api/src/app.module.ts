import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { StoreModule } from './store/store.module';
import { CustomerModule } from './customer/customer.module';
import { CategoryModule } from './category/category.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { OrderModule } from './order/order.module';
import { UploadModule } from './upload/upload.module';

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
    UploadModule,
  ],
})
export class AppModule {}
