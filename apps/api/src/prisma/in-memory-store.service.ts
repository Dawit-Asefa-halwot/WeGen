import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

export interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  roles: string[];
  createdAt: Date;
}

export interface MockCampaign {
  id: string;
  slug: string;
  title: string;
  story: string;
  categoryName: string;
  categorySlug: string;
  location: string;
  goalCents: bigint;
  raisedCents: bigint;
  supporterCount: number;
  coverImageUrl?: string;
  videoUrl?: string;
  campaignType: 'PERSONAL' | 'REFERRAL' | 'ORGANIZATION';
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'PUBLISHED' | 'COMPLETED' | 'REJECTED';
  isVerified: boolean;
  userId: string;
  creatorName: string;
  organizationId?: string;
  organizationName?: string;
  beneficiary?: {
    name: string;
    phone?: string;
    relationship?: string;
    isReferral?: boolean;
  };
  updates: Array<{ id: string; title: string; content: string; createdAt: Date }>;
  createdAt: Date;
}

export interface MockDonation {
  id: string;
  donationReference: string;
  campaignId: string;
  donorUserId?: string;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  isAnonymous: boolean;
  amountCents: bigint;
  platformFeeCents: bigint;
  paymentFeeCents: bigint;
  netAmountCents: bigint;
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED';
  paymentProvider: string;
  providerReferenceId?: string;
  message?: string;
  createdAt: Date;
}

@Injectable()
export class InMemoryStoreService {
  private readonly logger = new Logger(InMemoryStoreService.name);

  public users: MockUser[] = [];
  public campaigns: MockCampaign[] = [];
  public donations: MockDonation[] = [];
  public withdrawals: any[] = [];
  public organizations: any[] = [];
  public subscriptionPlans: any[] = [];

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const salt = bcrypt.genSaltSync(10);

    // 1. Users
    this.users = [
      {
        id: 'u-admin-1',
        email: 'admin@wegen.et',
        passwordHash: bcrypt.hashSync('AdminWeGen2026!', salt),
        firstName: 'WeGen',
        lastName: 'Administrator',
        phoneNumber: '+251911000000',
        isEmailVerified: true,
        roles: ['ADMIN', 'USER'],
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'u-fundraiser-1',
        email: 'fundraiser@wegen.et',
        passwordHash: bcrypt.hashSync('Fundraiser2026!', salt),
        firstName: 'Abebe',
        lastName: 'Bikila',
        phoneNumber: '+251911111111',
        isEmailVerified: true,
        roles: ['FUNDRAISER', 'USER'],
        createdAt: new Date('2026-02-01'),
      },
      {
        id: 'u-org-1',
        email: 'contact@redcross.et',
        passwordHash: bcrypt.hashSync('OrgPass2026!', salt),
        firstName: 'Ethiopian',
        lastName: 'Red Cross',
        phoneNumber: '+251911222222',
        isEmailVerified: true,
        roles: ['ORGANIZATION_ADMIN', 'USER'],
        createdAt: new Date('2026-02-15'),
      },
    ];

    // 2. Campaigns
    this.campaigns = [
      {
        id: 'c1',
        slug: 'help-chala-cardiac-surgery',
        title: 'Support Urgent Cardiac Surgery for 7-Year-Old Chala in Addis Ababa',
        story: 'Chala is a bright 7-year-old boy diagnosed with a congenital heart defect requiring urgent open-heart surgery.',
        categoryName: 'Medical & Healthcare',
        categorySlug: 'medical',
        location: 'Addis Ababa, Ethiopia',
        goalCents: BigInt(25000000), // 250,000 ETB
        raisedCents: BigInt(14500000), // 145,000 ETB
        supporterCount: 38,
        coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
        campaignType: 'PERSONAL',
        status: 'PUBLISHED',
        isVerified: true,
        userId: 'u-fundraiser-1',
        creatorName: 'Abebe Bikila',
        beneficiary: {
          name: 'Chala Bikila',
          phone: '+251911111111',
          relationship: 'Son / Family',
          isReferral: false,
        },
        updates: [
          {
            id: 'up1',
            title: 'Hospital Admission Update',
            content: 'Chala was admitted to the hospital cardiology wing today.',
            createdAt: new Date('2026-09-28'),
          },
        ],
        createdAt: new Date('2026-09-15'),
      },
      {
        id: 'c2',
        slug: 'clean-water-initiative-somali-region',
        title: 'Emergency Clean Water & Solar Borehole Well Construction in Somali Region',
        story: 'Drought conditions in Somali region have left thousands without clean drinking water.',
        categoryName: 'Disaster Relief',
        categorySlug: 'emergency',
        location: 'Jijiga, Somali Region',
        goalCents: BigInt(80000000), // 800,000 ETB
        raisedCents: BigInt(52000000), // 520,000 ETB
        supporterCount: 124,
        coverImageUrl: 'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?w=800&auto=format&fit=crop&q=80',
        campaignType: 'ORGANIZATION',
        status: 'PUBLISHED',
        isVerified: true,
        userId: 'u-org-1',
        creatorName: 'Ethiopian Red Cross',
        organizationId: 'org-1',
        organizationName: 'Ethiopian Red Cross Society',
        createdAt: new Date('2026-09-10'),
        updates: [],
      },
    ];

    // 3. Sample Donations
    this.donations = [
      {
        id: 'd1',
        donationReference: 'DON-20261003-AB12',
        campaignId: 'c1',
        donorUserId: 'u-fundraiser-1',
        donorName: 'Generous Supporter',
        donorEmail: 'donor@wegen.et',
        isAnonymous: false,
        amountCents: BigInt(100000), // 1,000 ETB
        platformFeeCents: BigInt(10000), // 100 ETB (10%)
        paymentFeeCents: BigInt(0),
        netAmountCents: BigInt(90000), // 900 ETB
        status: 'SUCCEEDED',
        paymentProvider: 'CHAPA',
        providerReferenceId: 'chapa_tx_DON-20261003-AB12',
        message: 'Wishing Chala a fast recovery!',
        createdAt: new Date('2026-10-02'),
      },
    ];

    // 4. Sample Subscription Plans
    this.subscriptionPlans = [
      { id: 'plan-1', name: 'Starter Org', code: 'STARTER', priceEtb: 5000, campaignLimit: 5 },
      { id: 'plan-2', name: 'Pro Organization', code: 'PRO', priceEtb: 12000, campaignLimit: 25 },
      { id: 'plan-3', name: 'Enterprise NGO', code: 'ENTERPRISE', priceEtb: 30000, campaignLimit: 100 },
    ];

    this.logger.log('✅ In-memory fallback store initialized with demo data');
  }
}
