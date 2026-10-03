import { Injectable } from '@nestjs/common';
import { CampaignType } from '@prisma/client';

export interface FeeCalculationResult {
  grossAmountCents: bigint;
  platformFeeCents: bigint;
  paymentFeeCents: bigint;
  netAmountCents: bigint;
  platformFeePercentage: number;
}

@Injectable()
export class FeeCalculatorService {
  /**
   * Calculates platform fee based on campaign type
   * Personal & Referral campaigns: 10% platform fee
   * Organization campaigns: 0% platform fee (subscription model)
   */
  calculateFees(amountEtb: number, campaignType: CampaignType, paymentFeePercentage: number = 0): FeeCalculationResult {
    const grossAmountCents = BigInt(Math.round(amountEtb * 100));

    let platformFeePercentage = 0;
    if (campaignType === CampaignType.PERSONAL || campaignType === CampaignType.REFERRAL) {
      platformFeePercentage = 10.0; // 10% platform fee requirement
    } else if (campaignType === CampaignType.ORGANIZATION) {
      platformFeePercentage = 0.0; // 0% fee requirement for org subscription model
    }

    const platformFeeCents = (grossAmountCents * BigInt(Math.round(platformFeePercentage * 10))) / BigInt(1000);
    const paymentFeeCents = (grossAmountCents * BigInt(Math.round(paymentFeePercentage * 10))) / BigInt(1000);
    const netAmountCents = grossAmountCents - platformFeeCents - paymentFeeCents;

    return {
      grossAmountCents,
      platformFeeCents,
      paymentFeeCents,
      netAmountCents,
      platformFeePercentage,
    };
  }
}
