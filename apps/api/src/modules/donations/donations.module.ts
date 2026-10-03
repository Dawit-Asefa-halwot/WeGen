import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { FeeCalculatorService } from './fee-calculator.service';

@Module({
  controllers: [DonationsController],
  providers: [DonationsService, FeeCalculatorService],
  exports: [DonationsService, FeeCalculatorService],
})
export class DonationsModule {}
