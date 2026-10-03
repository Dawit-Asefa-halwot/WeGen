import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from '../../common/services/storage.service';

@Module({
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
