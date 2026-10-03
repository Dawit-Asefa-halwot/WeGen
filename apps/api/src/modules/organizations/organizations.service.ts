import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterOrganizationInput } from '@wegen/validation';
import { UserRoleName, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async registerOrganization(dto: RegisterOrganizationInput, adminUserId: string) {
    const existing = await this.prisma.organization.findFirst({
      where: {
        OR: [
          { registrationNumber: dto.registrationNumber },
          { contactEmail: dto.contactEmail },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('Organization with this registration number or email already exists');
    }

    const slug = dto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: dto.subscriptionPlanId },
    });

    if (!plan) {
      throw new NotFoundException('Selected subscription plan not found');
    }

    const org = await this.prisma.$transaction(async (tx) => {
      // 1. Create Organization
      const createdOrg = await tx.organization.create({
        data: {
          name: dto.name,
          slug,
          registrationNumber: dto.registrationNumber,
          category: dto.category,
          contactEmail: dto.contactEmail,
          contactPhone: dto.contactPhone,
          website: dto.website,
          description: dto.description,
          status: 'PENDING', // Pending verification & subscription activation
          members: {
            create: [{ userId: adminUserId, role: 'ADMIN' }],
          },
        },
      });

      // 2. Grant ORGANIZATION_ADMIN role to user
      const orgRole = await tx.role.findUnique({ where: { name: UserRoleName.ORGANIZATION_ADMIN } });
      if (orgRole) {
        await tx.userRole.upsert({
          where: { userId_roleId: { userId: adminUserId, roleId: orgRole.id } },
          create: { userId: adminUserId, roleId: orgRole.id },
          update: {},
        });
      }

      // 3. Create Subscription Record
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await tx.organizationSubscription.create({
        data: {
          organizationId: createdOrg.id,
          planId: plan.id,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart: new Date(),
          currentPeriodEnd: periodEnd,
        },
      });

      return createdOrg;
    });

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      status: org.status,
    };
  }

  async getOrganizationBySlug(slug: string) {
    const org = await this.prisma.organization.findUnique({
      where: { slug },
      include: {
        campaigns: {
          where: { status: 'PUBLISHED' },
          include: { category: true },
        },
        subscriptions: { include: { plan: true } },
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      category: org.category,
      contactEmail: org.contactEmail,
      contactPhone: org.contactPhone,
      website: org.website,
      description: org.description,
      logoUrl: org.logoUrl,
      isVerified: org.isVerified,
      status: org.status,
      campaigns: org.campaigns.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        goalEtb: Number(c.goalCents) / 100,
        raisedEtb: Number(c.raisedCents) / 100,
        coverImageUrl: c.coverImageUrl,
      })),
    };
  }

  async getSubscriptionPlans() {
    const plans = await this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceCents: 'asc' },
    });

    return plans.map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      priceEtb: Number(p.priceCents) / 100,
      billingPeriod: p.billingPeriod,
      campaignLimit: p.campaignLimit,
      features: p.features,
    }));
  }
}
