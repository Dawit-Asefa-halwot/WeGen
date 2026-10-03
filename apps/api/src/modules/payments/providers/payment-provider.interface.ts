export interface InitiatePaymentParams {
  referenceId: string;
  amountEtb: number;
  title: string;
  donorName?: string;
  email?: string;
  phone?: string;
  callbackUrl: string;
  returnUrl: string;
}

export interface InitiatePaymentResult {
  checkoutUrl?: string;
  providerReferenceId: string;
  rawData: any;
}

export interface PaymentStatusResult {
  isSuccessful: boolean;
  amountEtb: number;
  status: string;
  providerReferenceId: string;
  rawData: any;
}

export interface IPaymentProvider {
  readonly providerCode: string;

  initiatePayment(params: InitiatePaymentParams): Promise<InitiatePaymentResult>;

  verifyWebhookSignature(headers: Record<string, any>, payload: any): boolean;

  verifyPaymentStatus(providerReferenceId: string): Promise<PaymentStatusResult>;
}
