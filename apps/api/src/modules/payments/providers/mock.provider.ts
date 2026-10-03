import { Injectable, Logger } from '@nestjs/common';
import { IPaymentProvider, InitiatePaymentParams, InitiatePaymentResult, PaymentStatusResult } from './payment-provider.interface';

@Injectable()
export class MockPaymentProvider implements IPaymentProvider {
  readonly providerCode = 'MOCK';
  private readonly logger = new Logger(MockPaymentProvider.name);

  async initiatePayment(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    this.logger.log(`Mock payment initiated for ref: ${params.referenceId}, Amount: ${params.amountEtb} ETB`);
    
    const providerReferenceId = `mock_tx_${Date.now()}_${params.referenceId}`;
    const checkoutUrl = `${params.returnUrl}?tx_ref=${params.referenceId}&provider_ref=${providerReferenceId}&status=success`;

    return {
      checkoutUrl,
      providerReferenceId,
      rawData: { mock: true, referenceId: params.referenceId, amountEtb: params.amountEtb },
    };
  }

  verifyWebhookSignature(headers: Record<string, any>, payload: any): boolean {
    return true; // Mock provider always verifies successfully
  }

  async verifyPaymentStatus(providerReferenceId: string): Promise<PaymentStatusResult> {
    this.logger.log(`Mock verification for tx: ${providerReferenceId}`);

    return {
      isSuccessful: true,
      amountEtb: 100,
      status: 'SUCCEEDED',
      providerReferenceId,
      rawData: { mockVerified: true, timestamp: new Date().toISOString() },
    };
  }
}
