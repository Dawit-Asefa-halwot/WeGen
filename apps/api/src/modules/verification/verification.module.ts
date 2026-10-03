import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { StorageService } from '../../common/services/storage.service';

@Module({
  controllers: [VerificationController],
  providers: [VerificationService, StorageService],
  exports: [VerificationService],
})
export class VerificationModule {}
