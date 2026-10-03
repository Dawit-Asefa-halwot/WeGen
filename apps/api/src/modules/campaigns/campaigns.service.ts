import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InMemoryStoreService, MockCampaign } from '../../prisma/in-memory-store.service';
import { CampaignType, CampaignStatus } from '@prisma/client';
import { CreateCampaignInput } from '@wegen/validation';
import * as crypto from 'crypto';

@Injectable()
export class CampaignsService {
  constructor(
    private prisma: PrismaService,
    private inMemoryStore: InMemoryStoreService,
  ) {}

  async createCampaign(dto: CreateCampaignInput, userId: string, organizationId?: string) {
    const slugBase = dto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const uniqueHash = crypto.randomBytes(3).toString('hex');
    const slug = `${slugBase}-${uniqueHash}`;

    let campaignType: 'PERSONAL' | 'REFERRAL' | 'ORGANIZATION' = 'PERSONAL';
    if (organizationId) {
      campaignType = 'ORGANIZATION';
    } else if (dto.isReferral) {
      campaignType = 'REFERRAL';
    }

    try {
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
          campaignType: campaignType as CampaignType,
          status: CampaignStatus.SUBMITTED,
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
        },
        include: { category: true, beneficiary: true },
      });

      return this.formatCampaign(campaign);
    } catch {
      // In-memory fallback
      const user = this.inMemoryStore.users.find((u) => u.id === userId);
      const newMock: MockCampaign = {
        id: `c-${Date.now()}`,
        slug,
        title: dto.title,
        story: dto.story,
        categoryName: 'Medical & Healthcare',
        categorySlug: 'medical',
        location: dto.location,
        goalCents: BigInt(Math.round(dto.goalEtb * 100)),
        raisedCents: BigInt(0),
        supporterCount: 0,
        coverImageUrl: dto.coverImageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
        videoUrl: dto.videoUrl,
        campaignType,
        status: 'SUBMITTED',
        isVerified: false,
        userId,
        creatorName: user ? `${user.firstName} ${user.lastName}` : 'Fundraiser',
        beneficiary: {
          name: dto.beneficiaryName || 'Beneficiary',
          phone: dto.beneficiaryPhone,
          relationship: dto.beneficiaryRelationship,
          isReferral: dto.isReferral,
        },
        updates: [],
        createdAt: new Date(),
      };

      this.inMemoryStore.campaigns.unshift(newMock);
      return this.formatMockCampaign(newMock);
    }
  }

  async discoverCampaigns(filters: {
    categorySlug?: string;
    campaignType?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page ? Math.max(1, filters.page) : 1;
    const limit = filters.limit ? Math.min(50, filters.limit) : 12;

    try {
      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        this.prisma.campaign.findMany({
          where: { status: 'PUBLISHED' },
          include: { category: true, user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.campaign.count({ where: { status: 'PUBLISHED' } }),
      ]);

      return {
        campaigns: items.map(this.formatCampaign),
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch {
      // In-memory fallback
      let list = this.inMemoryStore.campaigns.filter((c) => c.status === 'PUBLISHED');

      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter((c) => c.title.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
      }

      return {
        campaigns: list.map(this.formatMockCampaign),
        meta: { total: list.length, page, limit, totalPages: 1 },
      };
    }
  }

  async getCampaignBySlug(slug: string) {
    try {
      const campaign = await this.prisma.campaign.findUnique({
        where: { slug },
        include: { category: true, user: true, beneficiary: true, updates: true },
      });
      if (campaign) return this.formatCampaign(campaign);
    } catch {
      // fallback
    }

    const mock = this.inMemoryStore.campaigns.find((c) => c.slug === slug);
    if (!mock) throw new NotFoundException('Campaign not found');

    return this.formatMockCampaign(mock);
  }

  async getUserCampaigns(userId: string) {
    try {
      const items = await this.prisma.campaign.findMany({
        where: { userId },
        include: { category: true },
      });
      return items.map(this.formatCampaign);
    } catch {
      const list = this.inMemoryStore.campaigns.filter((c) => c.userId === userId);
      return list.map(this.formatMockCampaign);
    }
  }

  async addCampaignUpdate(campaignId: string, userId: string, title: string, content: string) {
    const mock = this.inMemoryStore.campaigns.find((c) => c.id === campaignId);
    if (mock) {
      const update = { id: `up-${Date.now()}`, title, content, createdAt: new Date() };
      mock.updates.push(update);
      return update;
    }
    throw new NotFoundException('Campaign not found');
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
      categorySlug: campaign.category?.slug || 'general',
      location: campaign.location,
      goalEtb,
      raisedEtb,
      percentComplete,
      supporterCount: campaign.supporterCount,
      coverImageUrl: campaign.coverImageUrl,
      campaignType: campaign.campaignType,
      status: campaign.status,
      isVerified: campaign.isVerified,
      creator: campaign.user ? `${campaign.user.firstName} ${campaign.user.lastName}` : undefined,
      beneficiary: campaign.beneficiary ? { name: campaign.beneficiary.name } : undefined,
      updates: campaign.updates || [],
      createdAt: campaign.createdAt,
    };
  }

  private formatMockCampaign(c: MockCampaign) {
    const goalEtb = Number(c.goalCents) / 100;
    const raisedEtb = Number(c.raisedCents) / 100;
    const percentComplete = goalEtb > 0 ? Math.min(100, Math.round((raisedEtb / goalEtb) * 100)) : 0;

    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      story: c.story,
      categoryName: c.categoryName,
      categorySlug: c.categorySlug,
      location: c.location,
      goalEtb,
      raisedEtb,
      percentComplete,
      supporterCount: c.supporterCount,
      coverImageUrl: c.coverImageUrl,
      campaignType: c.campaignType,
      status: c.status,
      isVerified: c.isVerified,
      creator: c.creatorName,
      beneficiary: c.beneficiary,
      updates: c.updates,
      createdAt: c.createdAt,
    };
  }
}
