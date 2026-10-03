import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWithdrawalInput } from '@wegen/validation';
import { WithdrawalStatus, TransactionType } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class WithdrawalsService {
  constructor(private prisma: PrismaService) {}

  async createWithdrawalRequest(dto: CreateWithdrawalInput, userId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: dto.campaignId },
      include: { beneficiary: true },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.userId !== userId) {
      throw new ForbiddenException('Only the campaign creator/authorized recipient can request withdrawals');
    }

    if (!campaign.isVerified) {
      throw new BadRequestException('Campaign must be verified before requesting funds withdrawal');
    }

    // 1. Calculate total raised net amount minus completed withdrawals
    const [donations, existingWithdrawals] = await Promise.all([
      this.prisma.donation.aggregate({
        where: { campaignId: campaign.id, status: 'SUCCEEDED' },
        _sum: { netAmountCents: true },
      }),
      this.prisma.withdrawal.aggregate({
        where: {
          campaignId: campaign.id,
          status: { in: [WithdrawalStatus.REQUESTED, WithdrawalStatus.UNDER_REVIEW, WithdrawalStatus.APPROVED, WithdrawalStatus.COMPLETED] },
        },
        _sum: { amountCents: true },
      }),
    ]);

    const totalNetCents = donations._sum.netAmountCents || BigInt(0);
    const totalWithdrawnCents = existingWithdrawals._sum.amountCents || BigInt(0);
    const availableBalanceCents = totalNetCents - totalWithdrawnCents;

    const requestedCents = BigInt(Math.round(dto.amountEtb * 100));
    if (requestedCents > availableBalanceCents) {
      const availEtb = Number(availableBalanceCents) / 100;
      throw new BadRequestException(`Insufficient available net balance. Available: ${availEtb} ETB`);
    }

    const reference = `WDR-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const withdrawal = await this.prisma.withdrawal.create({
      data: {
        reference,
        campaignId: campaign.id,
        requestedByUserId: userId,
        amountCents: requestedCents,
        bankName: dto.bankName,
        accountNumber: dto.accountNumber,
        accountHolderName: dto.accountHolderName,
        status: WithdrawalStatus.REQUESTED,
      },
    });

    return {
      withdrawalId: withdrawal.id,
      reference: withdrawal.reference,
      amountEtb: dto.amountEtb,
      bankName: withdrawal.bankName,
      status: withdrawal.status,
      createdAt: withdrawal.createdAt,
    };
  }

  async getWithdrawalQueue(status?: WithdrawalStatus) {
    const list = await this.prisma.withdrawal.findMany({
      where: status ? { status } : undefined,
      include: {
        campaign: { select: { title: true, slug: true, campaignType: true } },
        requestedBy: { select: { firstName: true, lastName: true, email: true, phoneNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return list.map((w) => ({
      id: w.id,
      reference: w.reference,
      campaignTitle: w.campaign.title,
      campaignSlug: w.campaign.slug,
      requesterName: `${w.requestedBy.firstName} ${w.requestedBy.lastName}`,
      amountEtb: Number(w.amountCents) / 100,
      bankName: w.bankName,
      accountNumber: w.accountNumber,
      accountHolderName: w.accountHolderName,
      status: w.status,
      createdAt: w.createdAt,
    }));
  }

  async reviewWithdrawal(withdrawalId: string, decision: 'APPROVE' | 'REJECT', notes: string, adminUserId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!withdrawal) throw new NotFoundException('Withdrawal request not found');

    const newStatus = decision === 'APPROVE' ? WithdrawalStatus.COMPLETED : WithdrawalStatus.REJECTED;

    await this.prisma.$transaction(async (tx) => {
      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: newStatus,
          reviewedByUserId: adminUserId,
          reviewerNotes: notes,
          processedAt: new Date(),
        },
      });

      if (decision === 'APPROVE') {
        await tx.transaction.create({
          data: {
            reference: `${withdrawal.reference}-DISBURSED`,
            withdrawalId: withdrawal.id,
            type: TransactionType.WITHDRAWAL,
            amountCents: withdrawal.amountCents,
            status: 'COMPLETED',
            description: `Withdrawal disbursement to ${withdrawal.accountHolderName} (${withdrawal.bankName})`,
          },
        });
      }
    });

    return { success: true, withdrawalId, status: newStatus };
  }
}
