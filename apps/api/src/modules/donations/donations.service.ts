import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FeeCalculatorService } from './fee-calculator.service';
import { OneTimeDonationInput } from '@wegen/validation';
import { DonationStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class DonationsService {
  constructor(
    private prisma: PrismaService,
    private feeCalculator: FeeCalculatorService,
  ) {}

  async createOneTimeDonation(dto: OneTimeDonationInput, donorUserId?: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: dto.campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.status !== 'PUBLISHED' && campaign.status !== 'FUNDING' && campaign.status !== 'VERIFIED') {
      throw new BadRequestException('Campaign is not currently accepting donations');
    }

    // Calculate platform fee based on business rules
    const fees = this.feeCalculator.calculateFees(dto.amountEtb, campaign.campaignType);

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const donationReference = `DON-${dateStr}-${randomHex}`;

    const donation = await this.prisma.donation.create({
      data: {
        donationReference,
        campaignId: campaign.id,
        donorUserId,
        donorName: dto.isAnonymous ? 'Anonymous' : (dto.donorName || 'Generous Supporter'),
        donorEmail: dto.donorEmail,
        donorPhone: dto.donorPhone,
        isAnonymous: dto.isAnonymous,
        amountCents: fees.grossAmountCents,
        platformFeeCents: fees.platformFeeCents,
        paymentFeeCents: fees.paymentFeeCents,
        netAmountCents: fees.netAmountCents,
        status: DonationStatus.PENDING,
        paymentProvider: dto.paymentProvider,
        message: dto.message,
      },
    });

    return {
      donationId: donation.id,
      donationReference: donation.donationReference,
      amountEtb: dto.amountEtb,
      platformFeeEtb: Number(fees.platformFeeCents) / 100,
      netAmountEtb: Number(fees.netAmountCents) / 100,
      paymentProvider: dto.paymentProvider,
    };
  }

  async getCampaignDonations(campaignId: string, limit: number = 20, offset: number = 0) {
    const donations = await this.prisma.donation.findMany({
      where: {
        campaignId,
        status: DonationStatus.SUCCEEDED,
      },
      select: {
        id: true,
        donorName: true,
        isAnonymous: true,
        amountCents: true,
        message: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return donations.map((d) => ({
      id: d.id,
      donorName: d.isAnonymous ? 'Anonymous Supporter' : (d.donorName || 'Supporter'),
      amountEtb: Number(d.amountCents) / 100,
      message: d.message,
      createdAt: d.createdAt,
    }));
  }

  async getUserDonations(userId: string) {
    const donations = await this.prisma.donation.findMany({
      where: { donorUserId: userId },
      include: {
        campaign: {
          select: { title: true, slug: true, coverImageUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return donations.map((d) => ({
      id: d.id,
      donationReference: d.donationReference,
      campaignTitle: d.campaign.title,
      campaignSlug: d.campaign.slug,
      coverImageUrl: d.campaign.coverImageUrl,
      amountEtb: Number(d.amountCents) / 100,
      status: d.status,
      createdAt: d.createdAt,
    }));
  }

  async getReceipt(donationReference: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { donationReference },
      include: {
        campaign: {
          select: { title: true, slug: true, campaignType: true },
        },
      },
    });

    if (!donation) {
      throw new NotFoundException('Donation receipt not found');
    }

    return {
      receiptNumber: donation.donationReference,
      donorName: donation.isAnonymous ? 'Anonymous' : (donation.donorName || 'Supporter'),
      donorEmail: donation.donorEmail,
      campaignTitle: donation.campaign.title,
      campaignType: donation.campaign.campaignType,
      grossAmountEtb: Number(donation.amountCents) / 100,
      platformFeeEtb: Number(donation.platformFeeCents) / 100,
      netAmountEtb: Number(donation.netAmountCents) / 100,
      paymentProvider: donation.paymentProvider,
      status: donation.status,
      date: donation.createdAt,
    };
  }
}
