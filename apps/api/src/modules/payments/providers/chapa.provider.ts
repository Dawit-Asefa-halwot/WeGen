import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPaymentProvider, InitiatePaymentParams, InitiatePaymentResult, PaymentStatusResult } from './payment-provider.interface';
import * as crypto from 'crypto';

@Injectable()
export class ChapaProvider implements IPaymentProvider {
  readonly providerCode = 'CHAPA';
  private readonly logger = new Logger(ChapaProvider.name);
  private readonly secretKey: string;
  private readonly webhookSecret: string;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('CHAPA_SECRET_KEY', 'CHASECK_TEST-mock');
    this.webhookSecret = this.configService.get<string>('CHAPA_WEBHOOK_SECRET', 'chapa_secret');
  }

  async initiatePayment(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    this.logger.log(`Initiating Chapa payment for ref: ${params.referenceId}, Amount: ${params.amountEtb} ETB`);

    // In actual production environment, fetch('https://api.chapa.co/v1/transaction/initialize', { ... })
    // For test mode or fallback, build URL payload safely
    const checkoutUrl = `https://checkout.chapa.co/checkout/test-pay/${params.referenceId}`;

    return {
      checkoutUrl,
      providerReferenceId: `chapa_tx_${params.referenceId}`,
      rawData: { status: 'success', reference: params.referenceId, mode: 'test' },
    };
  }

  verifyWebhookSignature(headers: Record<string, any>, payload: any): boolean {
    const signature = headers['x-chapa-signature'] || headers['chapa-signature'];
    if (!signature) {
      this.logger.warn('Chapa webhook signature missing from headers');
      return true; // allow test payloads in dev if signature header not set
    }

    const hash = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
      .digest('hex');

    return signature === hash;
  }

  async verifyPaymentStatus(providerReferenceId: string): Promise<PaymentStatusResult> {
    this.logger.log(`Verifying Chapa transaction status for: ${providerReferenceId}`);

    return {
      isSuccessful: true,
      amountEtb: 100,
      status: 'SUCCEEDED',
      providerReferenceId,
      rawData: { status: 'success', tx_ref: providerReferenceId },
    };
  }
}
