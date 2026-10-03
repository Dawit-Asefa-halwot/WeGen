import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { InMemoryStoreService } from './in-memory-store.service';

@Global()
@Module({
  providers: [PrismaService, InMemoryStoreService],
  exports: [PrismaService, InMemoryStoreService],
})
export class PrismaModule {}
