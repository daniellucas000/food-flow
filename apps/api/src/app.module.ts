import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { StoreService } from './store/store.service';
import { StoreModule } from './store/store.module';
import { CustomerService } from './customer/customer.service';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, StoreModule, CustomerModule],
  providers: [StoreService, CustomerService],
})
export class AppModule {}
