import { PrismaClient, UserRoleName, CampaignType, CampaignStatus, SubscriptionStatus, RecurringFrequency, RecurringStatus, DonationStatus } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  // Simple deterministic hash for seed data (in app, argon2 / bcrypt will be used)
  return crypto.createHash('sha256').update(password + 'wegen_salt').digest('hex');
}

async function main() {
  console.log('🌱 Starting WeGen Database Seeding...');

  // 1. Roles
  const roles = [
    { name: UserRoleName.ADMIN, description: 'System Administrator with full access' },
    { name: UserRoleName.USER, description: 'Standard registered platform user' },
    { name: UserRoleName.DONOR, description: 'User who supports campaigns' },
    { name: UserRoleName.FUNDRAISER, description: 'User who creates personal campaigns' },
    { name: UserRoleName.REFERRER, description: 'User who refers others in need' },
    { name: UserRoleName.ORGANIZATION_ADMIN, description: 'Administrator for an approved organization' },
    { name: UserRoleName.ORGANIZATION_MEMBER, description: 'Member of an organization team' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role
    });
  }
  console.log('✅ Roles seeded');

  // 2. Categories
  const categories = [
    { name: 'Medical & Healthcare', slug: 'medical', description: 'Urgent surgeries, treatments, and medication support', icon: 'HeartPulse' },
    { name: 'Education & Schools', slug: 'education', description: 'Tuition, books, school supplies, and scholarships', icon: 'GraduationCap' },
    { name: 'Emergency & Relief', slug: 'emergency', description: 'Crisis response, disaster assistance, and emergency aid', icon: 'AlertTriangle' },
    { name: 'Food & Nutrition', slug: 'food', description: 'Community feeding programs and family food security', icon: 'Utensils' },
    { name: 'Housing & Shelter', slug: 'housing', description: 'Home repair, rent assistance, and displacement shelter', icon: 'Home' },
    { name: 'Children & Youth', slug: 'children', description: 'Child welfare, orphan care, and youth empowerment', icon: 'Baby' },
    { name: 'Disaster Relief', slug: 'disaster-relief', description: 'Drought, flood, and natural disaster relief', icon: 'Flame' },
    { name: 'Community Projects', slug: 'community', description: 'Local infrastructure, clean water, and community growth', icon: 'Users' },
    { name: 'Other Causes', slug: 'other', description: 'General fundraising and special causes', icon: 'HelpCircle' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, icon: cat.icon },
      create: cat
    });
  }
  console.log('✅ Categories seeded');

  // 3. Subscription Plans for Organizations
  const plans = [
    {
      name: 'Starter Org',
      code: 'STARTER',
      priceCents: BigInt(500000), // 5,000 ETB / month
      billingPeriod: 'MONTHLY',
      campaignLimit: 5,
      features: { maxCampaigns: 5, dedicatedSupport: false, verifiedBadge: true, feeExempt: true }
    },
    {
      name: 'Pro Organization',
      code: 'PRO',
      priceCents: BigInt(1200000), // 12,000 ETB / month
      billingPeriod: 'MONTHLY',
      campaignLimit: 25,
      features: { maxCampaigns: 25, dedicatedSupport: true, verifiedBadge: true, feeExempt: true, customBranding: true }
    },
    {
      name: 'Enterprise NGO',
      code: 'ENTERPRISE',
      priceCents: BigInt(3000000), // 30,000 ETB / month
      billingPeriod: 'MONTHLY',
      campaignLimit: 100,
      features: { maxCampaigns: 100, dedicatedSupport: true, verifiedBadge: true, feeExempt: true, customBranding: true, analyticsExport: true }
    }
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { code: plan.code },
      update: { name: plan.name, priceCents: plan.priceCents, campaignLimit: plan.campaignLimit },
      create: plan
    });
  }
  console.log('✅ Subscription Plans seeded');

  // 4. Payment Providers
  const providers = [
    { code: 'CHAPA', name: 'Chapa Payment Gateway', isActive: true, config: { testMode: true } },
    { code: 'TELEBIRR', name: 'Ethio Telecom Telebirr', isActive: true, config: { testMode: true } },
    { code: 'CBE_BIRR', name: 'Commercial Bank of Ethiopia (CBE Birr)', isActive: true, config: { testMode: true } },
    { code: 'STRIPE', name: 'Stripe International', isActive: true, config: { testMode: true } },
    { code: 'MOCK', name: 'Development Mock Provider', isActive: true, config: { testMode: true } }
  ];

  for (const prov of providers) {
    await prisma.paymentProvider.upsert({
      where: { code: prov.code },
      update: { name: prov.name, isActive: prov.isActive },
      create: prov
    });
  }
  console.log('✅ Payment Providers seeded');

  // 5. Seed Initial Admin Account (Demo/Dev only)
  const adminRole = await prisma.role.findUnique({ where: { name: UserRoleName.ADMIN } });
  const userRole = await prisma.role.findUnique({ where: { name: UserRoleName.USER } });
  const fundraiserRole = await prisma.role.findUnique({ where: { name: UserRoleName.FUNDRAISER } });
  const orgAdminRole = await prisma.role.findUnique({ where: { name: UserRoleName.ORGANIZATION_ADMIN } });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@wegen.et' },
    update: {},
    create: {
      email: 'admin@wegen.et',
      passwordHash: hashPassword('AdminWeGen2026!'),
      firstName: 'WeGen',
      lastName: 'Administrator',
      phoneNumber: '+251911000000',
      isEmailVerified: true,
      roles: {
        create: [
          { roleId: adminRole!.id },
          { roleId: userRole!.id }
        ]
      }
    }
  });
  console.log('✅ System Admin account created (admin@wegen.et)');

  // 6. Seed Demo Fundraiser & Referral User
  const demoFundraiser = await prisma.user.upsert({
    where: { email: 'fundraiser@wegen.et' },
    update: {},
    create: {
      email: 'fundraiser@wegen.et',
      passwordHash: hashPassword('Fundraiser2026!'),
      firstName: 'Abebe',
      lastName: 'Bikila',
      phoneNumber: '+251911111111',
      isEmailVerified: true,
      roles: {
        create: [{ roleId: userRole!.id }, { roleId: fundraiserRole!.id }]
      }
    }
  });

  // 7. Seed Demo Organization & Organization Admin
  const orgAdminUser = await prisma.user.upsert({
    where: { email: 'contact@redcross.et' },
    update: {},
    create: {
      email: 'contact@redcross.et',
      passwordHash: hashPassword('OrgPass2026!'),
      firstName: 'Ethiopian',
      lastName: 'Red Cross',
      phoneNumber: '+251911222222',
      isEmailVerified: true,
      roles: {
        create: [{ roleId: userRole!.id }, { roleId: orgAdminRole!.id }]
      }
    }
  });

  const demoOrg = await prisma.organization.upsert({
    where: { slug: 'ethiopian-red-cross' },
    update: {},
    create: {
      name: 'Ethiopian Red Cross Society',
      slug: 'ethiopian-red-cross',
      registrationNumber: 'NGO-ETH-1935',
      category: 'Humanitarian Charity',
      contactEmail: 'contact@redcross.et',
      contactPhone: '+251911222222',
      website: 'https://redcrosseth.org',
      description: 'Humanitarian organization serving communities across Ethiopia in emergency response, healthcare, and disaster relief.',
      isVerified: true,
      status: 'ACTIVE',
      members: {
        create: [{ userId: orgAdminUser.id, role: 'ADMIN' }]
      }
    }
  });

  // Assign organization subscription
  const proPlan = await prisma.subscriptionPlan.findUnique({ where: { code: 'PRO' } });
  if (proPlan) {
    const existingSub = await prisma.organizationSubscription.findFirst({
      where: { organizationId: demoOrg.id }
    });
    if (!existingSub) {
      await prisma.organizationSubscription.create({
        data: {
          organizationId: demoOrg.id,
          planId: proPlan.id,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    }
  }

  // 8. Seed Demo Campaigns (Personal, Referral, Organization)
  const medicalCat = await prisma.category.findUnique({ where: { slug: 'medical' } });
  const emergencyCat = await prisma.category.findUnique({ where: { slug: 'emergency' } });

  if (medicalCat && emergencyCat) {
    // Personal Campaign
    await prisma.campaign.upsert({
      where: { slug: 'help-chala-cardiac-surgery' },
      update: {},
      create: {
        slug: 'help-chala-cardiac-surgery',
        title: 'Support Urgent Cardiac Surgery for 7-Year-Old Chala',
        story: 'Chala is a bright 7-year-old boy diagnosed with a congenital heart defect. He urgently requires open-heart surgery overseas to save his life. Our family has raised part of the cost, but we need your compassionate support to reach our goal.',
        categoryId: medicalCat.id,
        location: 'Addis Ababa, Ethiopia',
        goalCents: BigInt(25000000), // 250,000 ETB
        raisedCents: BigInt(14500000), // 145,000 ETB
        supporterCount: 38,
        coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
        campaignType: CampaignType.PERSONAL,
        status: CampaignStatus.PUBLISHED,
        isVerified: true,
        userId: demoFundraiser.id,
        beneficiary: {
          create: {
            name: 'Chala Bikila',
            phone: '+251911111111',
            relationshipToCreator: 'Self/Son',
            isReferralBeneficiary: false,
            bankName: 'Commercial Bank of Ethiopia',
            accountNumber: '1000123456789',
            accountHolderName: 'Abebe Bikila'
          }
        }
      }
    });

    // Organization Campaign (0% Platform fee model)
    await prisma.campaign.upsert({
      where: { slug: 'clean-water-initiative-somali-region' },
      update: {},
      create: {
        slug: 'clean-water-initiative-somali-region',
        title: 'Emergency Clean Water & Borehole Well Construction in Somali Region',
        story: 'Drought conditions in parts of the Somali region have left thousands of pastoral families without safe drinking water. Ethiopian Red Cross is deploying mobile water purification trucks and drilling 2 high-yield solar borehole wells.',
        categoryId: emergencyCat.id,
        location: 'Jijiga, Somali Region',
        goalCents: BigInt(80000000), // 800,000 ETB
        raisedCents: BigInt(52000000), // 520,000 ETB
        supporterCount: 124,
        coverImageUrl: 'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?w=800&auto=format&fit=crop&q=80',
        campaignType: CampaignType.ORGANIZATION,
        status: CampaignStatus.PUBLISHED,
        isVerified: true,
        userId: orgAdminUser.id,
        organizationId: demoOrg.id,
        beneficiary: {
          create: {
            name: 'Somali Region Rural Communities',
            isReferralBeneficiary: false,
            bankName: 'Commercial Bank of Ethiopia',
            accountNumber: '1000999888777',
            accountHolderName: 'Ethiopian Red Cross Society'
          }
        }
      }
    });
  }

  console.log('✅ Demo Campaigns seeded successfully!');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
