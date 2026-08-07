import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StoreController } from './store.controller';

@Module({
  imports: [PrismaModule],
  providers: [StoreService],
  exports: [StoreService],
  controllers: [StoreController],
})
export class StoreModule {}
