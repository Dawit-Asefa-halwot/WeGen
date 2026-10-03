import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FeeCalculatorService } from '../donations/fee-calculator.service';
import { ChapaProvider } from './providers/chapa.provider';
import { MockPaymentProvider } from './providers/mock.provider';
import { IPaymentProvider, InitiatePaymentParams } from './providers/payment-provider.interface';
import { DonationStatus, TransactionType } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly providers = new Map<string, IPaymentProvider>();

  constructor(
    private prisma: PrismaService,
    private feeCalculator: FeeCalculatorService,
    private chapaProvider: ChapaProvider,
    private mockProvider: MockPaymentProvider,
  ) {
    this.providers.set('CHAPA', chapaProvider);
    this.providers.set('MOCK', mockProvider);
  }

  getProvider(providerCode: string = 'CHAPA'): IPaymentProvider {
    const provider = this.providers.get(providerCode.toUpperCase());
    if (!provider) {
      return this.mockProvider;
    }
    return provider;
  }

  async initiatePayment(donationId: string, providerCode: string = 'CHAPA', returnUrl?: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      include: { campaign: true },
    });

    if (!donation) {
      throw new NotFoundException('Donation record not found');
    }

    const provider = this.getProvider(providerCode);
    const amountEtb = Number(donation.amountCents) / 100;
    const defaultReturnUrl = returnUrl || `http://localhost:3000/campaign/${donation.campaign.slug}?donation_status=success`;

    const result = await provider.initiatePayment({
      referenceId: donation.donationReference,
      amountEtb,
      title: `Donation to ${donation.campaign.title}`,
      donorName: donation.donorName || 'Anonymous Supporter',
      email: donation.donorEmail || undefined,
      phone: donation.donorPhone || undefined,
      callbackUrl: `http://localhost:4000/api/v1/payments/webhook/${provider.providerCode}`,
      returnUrl: defaultReturnUrl,
    });

    await this.prisma.donation.update({
      where: { id: donation.id },
      data: {
        providerReferenceId: result.providerReferenceId,
        paymentProvider: provider.providerCode,
        status: DonationStatus.PROCESSING,
      },
    });

    return result;
  }

  /**
   * Processes payment webhooks with idempotency and atomic DB transactions
   */
  async processWebhook(providerCode: string, headers: Record<string, any>, payload: any) {
    this.logger.log(`Processing Webhook for provider: ${providerCode}`);

    const provider = this.getProvider(providerCode);
    const isValid = provider.verifyWebhookSignature(headers, payload);
    if (!isValid) {
      this.logger.warn(`Invalid webhook signature for ${providerCode}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    const providerRef = payload.tx_ref || payload.providerReferenceId || payload.id;
    if (!providerRef) {
      throw new BadRequestException('Missing provider reference ID in webhook payload');
    }

    // 1. Idempotency check
    const existingEvent = await this.prisma.paymentEvent.findFirst({
      where: { providerReferenceId: String(providerRef) },
    });

    if (existingEvent) {
      this.logger.log(`Webhook for ${providerRef} already processed. Skipping duplicate execution.`);
      return { success: true, message: 'Idempotent duplicate ignored' };
    }

    // Record Payment Event log
    await this.prisma.paymentEvent.create({
      data: {
        providerCode,
        eventType: payload.event || 'PAYMENT_SUCCESS',
        providerReferenceId: String(providerRef),
        rawPayload: payload,
        isVerified: true,
      },
    });

    // 2. Find associated donation record
    const donation = await this.prisma.donation.findFirst({
      where: {
        OR: [
          { providerReferenceId: String(providerRef) },
          { donationReference: String(providerRef) },
        ],
      },
      include: { campaign: true },
    });

    if (!donation) {
      this.logger.warn(`No donation found matching reference: ${providerRef}`);
      return { success: true, message: 'Payment logged but no matching donation found' };
    }

    if (donation.status === DonationStatus.SUCCEEDED) {
      return { success: true, message: 'Donation already completed' };
    }

    // 3. Execute atomic DB transaction
    await this.prisma.$transaction(async (tx) => {
      // Update Donation
      await tx.donation.update({
        where: { id: donation.id },
        data: {
          status: DonationStatus.SUCCEEDED,
          updatedAt: new Date(),
        },
      });

      // Update Campaign totals
      await tx.campaign.update({
        where: { id: donation.campaignId },
        data: {
          raisedCents: { increment: donation.amountCents },
          supporterCount: { increment: 1 },
        },
      });

      // Create Ledger Transaction records
      const txRef = `TX-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      await tx.transaction.create({
        data: {
          reference: txRef,
          donationId: donation.id,
          type: TransactionType.DONATION,
          amountCents: donation.amountCents,
          status: 'COMPLETED',
          description: `Gross donation from ${donation.donorName || 'Anonymous'} to ${donation.campaign.title}`,
        },
      });

      if (donation.platformFeeCents > BigInt(0)) {
        await tx.transaction.create({
          data: {
            reference: `${txRef}-FEE`,
            donationId: donation.id,
            type: TransactionType.PLATFORM_FEE,
            amountCents: donation.platformFeeCents,
            status: 'COMPLETED',
            description: `10% WeGen Platform Fee for donation ${donation.donationReference}`,
          },
        });
      }
    });

    this.logger.log(`Successfully completed donation ${donation.donationReference} via webhook`);
    return { success: true, message: 'Donation confirmed and ledger updated' };
  }
}
