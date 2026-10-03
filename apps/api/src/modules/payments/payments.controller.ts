import { Controller, Post, Body, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initiate')
  async initiatePayment(
    @Body() body: { donationId: string; providerCode?: string; returnUrl?: string }
  ) {
    return this.paymentsService.initiatePayment(body.donationId, body.providerCode, body.returnUrl);
  }

  @Post('webhook/:providerCode')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Param('providerCode') providerCode: string,
    @Headers() headers: Record<string, any>,
    @Body() body: any
  ) {
    return this.paymentsService.processWebhook(providerCode, headers, body);
  }
}
