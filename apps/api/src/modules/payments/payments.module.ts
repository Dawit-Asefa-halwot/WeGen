import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { FeeCalculatorService } from '../donations/fee-calculator.service';
import { ChapaProvider } from './providers/chapa.provider';
import { MockPaymentProvider } from './providers/mock.provider';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    FeeCalculatorService,
    ChapaProvider,
    MockPaymentProvider,
  ],
  exports: [PaymentsService, FeeCalculatorService],
})
export class PaymentsModule {}
