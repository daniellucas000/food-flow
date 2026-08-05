import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { StoreService } from './store/store.service';
import { StoreModule } from './store/store.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, StoreModule],
  providers: [StoreService],
})
export class AppModule {}
