import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardOverview() {
    const [
      totalUsers,
      activeCampaigns,
      pendingVerifications,
      donationsAgg,
      withdrawalsAgg,
      totalOrganizations,
      activeSubscriptions,
      auditLogCount
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.campaign.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.campaign.count({ where: { status: 'SUBMITTED' } }),
      this.prisma.donation.aggregate({
        where: { status: 'SUCCEEDED' },
        _sum: { amountCents: true, platformFeeCents: true },
        _count: true,
      }),
      this.prisma.withdrawal.aggregate({
        where: { status: 'REQUESTED' },
        _sum: { amountCents: true },
        _count: true,
      }),
      this.prisma.organization.count(),
      this.prisma.organizationSubscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.auditLog.count(),
    ]);

    const totalDonationVolumeEtb = Number(donationsAgg._sum.amountCents || BigInt(0)) / 100;
    const totalPlatformFeesEtb = Number(donationsAgg._sum.platformFeeCents || BigInt(0)) / 100;
    const pendingWithdrawalAmountEtb = Number(withdrawalsAgg._sum.amountCents || BigInt(0)) / 100;

    return {
      overview: {
        totalUsers,
        activeCampaigns,
        pendingVerifications,
        totalDonationsCount: donationsAgg._count,
        totalDonationVolumeEtb,
        totalPlatformFeesEtb,
        pendingWithdrawalsCount: withdrawalsAgg._count,
        pendingWithdrawalAmountEtb,
        totalOrganizations,
        activeSubscriptions,
        auditLogCount,
      },
    };
  }

  async getUsersList(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          isEmailVerified: true,
          createdAt: true,
          roles: { include: { role: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: `${u.firstName} ${u.lastName}`,
        phoneNumber: u.phoneNumber,
        isEmailVerified: u.isEmailVerified,
        roles: u.roles.map((r) => r.role.name),
        createdAt: u.createdAt,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getAuditLogs(limit: number = 50) {
    return this.prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { email: true, firstName: true, lastName: true } },
      },
    });
  }
}
