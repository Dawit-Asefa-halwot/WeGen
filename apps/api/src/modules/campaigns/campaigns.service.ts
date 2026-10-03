import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CampaignType, CampaignStatus } from '@prisma/client';
import { CreateCampaignInput } from '@wegen/validation';
import * as crypto from 'crypto';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async createCampaign(dto: CreateCampaignInput, userId: string, organizationId?: string) {
    const slugBase = dto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const uniqueHash = crypto.randomBytes(3).toString('hex');
    const slug = `${slugBase}-${uniqueHash}`;

    let campaignType: CampaignType = CampaignType.PERSONAL;
    if (organizationId) {
      campaignType = CampaignType.ORGANIZATION;
    } else if (dto.isReferral) {
      campaignType = CampaignType.REFERRAL;
    }

    const campaign = await this.prisma.campaign.create({
      data: {
        slug,
        title: dto.title,
        story: dto.story,
        categoryId: dto.categoryId,
        location: dto.location,
        goalCents: BigInt(Math.round(dto.goalEtb * 100)),
        coverImageUrl: dto.coverImageUrl,
        videoUrl: dto.videoUrl,
        campaignType,
        status: CampaignStatus.SUBMITTED, // Starts in SUBMITTED status for verification
        userId,
        organizationId,
        beneficiary: {
          create: {
            name: dto.beneficiaryName || 'Campaign Beneficiary',
            phone: dto.beneficiaryPhone,
            relationshipToCreator: dto.beneficiaryRelationship,
            isReferralBeneficiary: dto.isReferral || false,
          },
        },
        referral: dto.isReferral && dto.referralReason ? {
          create: {
            referrerUserId: userId,
            reason: dto.referralReason,
            status: 'SUBMITTED',
          },
        } : undefined,
      },
      include: {
        category: true,
        beneficiary: true,
        referral: true,
      },
    });

    return this.formatCampaign(campaign);
  }

  async discoverCampaigns(filters: {
    categorySlug?: string;
    campaignType?: CampaignType;
    status?: CampaignStatus;
    location?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page ? Math.max(1, filters.page) : 1;
    const limit = filters.limit ? Math.min(50, filters.limit) : 12;
    const skip = (page - 1) * limit;

    const where: any = {
      status: filters.status || CampaignStatus.PUBLISHED,
    };

    if (filters.categorySlug) {
      where.category = { slug: filters.categorySlug };
    }
    if (filters.campaignType) {
      where.campaignType = filters.campaignType;
    }
    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { story: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        include: {
          category: true,
          user: { select: { id: true, firstName: true, lastName: true } },
          organization: { select: { id: true, name: true, slug: true, isVerified: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.campaign.count({ where }),
    ]);

    return {
      campaigns: items.map(this.formatCampaign),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCampaignBySlug(slug: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { slug },
      include: {
        category: true,
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        organization: { select: { id: true, name: true, slug: true, logoUrl: true, isVerified: true } },
        beneficiary: true,
        referral: { include: { referrer: { select: { firstName: true, lastName: true } } } },
        updates: { orderBy: { createdAt: 'desc' } },
        media: true,
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return this.formatCampaign(campaign);
  }

  async getUserCampaigns(userId: string) {
    const campaigns = await this.prisma.campaign.findMany({
      where: { userId },
      include: { category: true, beneficiary: true },
      orderBy: { createdAt: 'desc' },
    });

    return campaigns.map(this.formatCampaign);
  }

  async addCampaignUpdate(campaignId: string, userId: string, title: string, content: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.userId !== userId) throw new ForbiddenException('Only creator can add updates');

    return this.prisma.campaignUpdate.create({
      data: { campaignId, title, content },
    });
  }

  private formatCampaign(campaign: any) {
    const goalEtb = Number(campaign.goalCents) / 100;
    const raisedEtb = Number(campaign.raisedCents) / 100;
    const percentComplete = goalEtb > 0 ? Math.min(100, Math.round((raisedEtb / goalEtb) * 100)) : 0;

    return {
      id: campaign.id,
      slug: campaign.slug,
      title: campaign.title,
      story: campaign.story,
      categoryName: campaign.category?.name || 'General',
      categorySlug: campaign.category?.slug,
      location: campaign.location,
      goalEtb,
      raisedEtb,
      percentComplete,
      supporterCount: campaign.supporterCount,
      coverImageUrl: campaign.coverImageUrl,
      videoUrl: campaign.videoUrl,
      campaignType: campaign.campaignType,
      status: campaign.status,
      isVerified: campaign.isVerified,
      creator: campaign.user ? `${campaign.user.firstName} ${campaign.user.lastName}` : undefined,
      organization: campaign.organization ? {
        id: campaign.organization.id,
        name: campaign.organization.name,
        slug: campaign.organization.slug,
        isVerified: campaign.organization.isVerified,
      } : undefined,
      beneficiary: campaign.beneficiary ? {
        name: campaign.beneficiary.name,
        relationship: campaign.beneficiary.relationshipToCreator,
        isReferral: campaign.beneficiary.isReferralBeneficiary,
      } : undefined,
      updates: campaign.updates || [],
      media: campaign.media || [],
      createdAt: campaign.createdAt,
    };
  }
}
