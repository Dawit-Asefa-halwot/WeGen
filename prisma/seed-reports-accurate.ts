import { PrismaClient, DonationStatus, UserRoleName, CampaignType, CampaignStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function seedAccurateData() {
  console.log('🌱 Seeding compliant audit data (PlatformSettings, PayoutAccounts, Donations with 10% fee & tips)...');

  // 1. Seed Platform Setting for dynamic fee rate
  await prisma.platformSetting.upsert({
    where: { key: 'PLATFORM_FEE_PERCENT' },
    update: { value: '10.0', effectiveFrom: new Date('2025-01-01T00:00:00Z') },
    create: {
      key: 'PLATFORM_FEE_PERCENT',
      value: '10.0',
      effectiveFrom: new Date('2025-01-01T00:00:00Z'),
    },
  });
  console.log('✅ PlatformSetting verified: PLATFORM_FEE_PERCENT = 10.0');

  // 2. Ensure Super Admin, Admins, Donors, Fundraisers exist
  const adminRole = await prisma.role.findUnique({ where: { name: UserRoleName.ADMIN } });
  const superAdminRole = await prisma.role.findUnique({ where: { name: UserRoleName.SUPER_ADMIN } });
  const userRole = await prisma.role.findUnique({ where: { name: UserRoleName.USER } });
  const donorRole = await prisma.role.findUnique({ where: { name: UserRoleName.DONOR } });
  const fundraiserRole = await prisma.role.findUnique({ where: { name: UserRoleName.FUNDRAISER } });

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@wegen.et' },
    update: { isActive: true },
    create: {
      email: 'superadmin@wegen.et',
      passwordHash: await hash('SuperAdmin2026!'),
      firstName: 'Dr. Almaz',
      lastName: 'Worku (Super Admin)',
      isEmailVerified: true,
      isActive: true,
      roles: {
        create: [{ roleId: superAdminRole!.id }, { roleId: userRole!.id }],
      },
    },
  });

  const fundraiser = await prisma.user.upsert({
    where: { email: 'fundraiser@wegen.et' },
    update: {},
    create: {
      email: 'fundraiser@wegen.et',
      passwordHash: await hash('Fundraiser2026!'),
      firstName: 'Abebe',
      lastName: 'Bikila',
      phoneNumber: '+251911111111',
      isEmailVerified: true,
      roles: {
        create: [{ roleId: fundraiserRole!.id }, { roleId: userRole!.id }],
      },
    },
  });

  const donor1 = await prisma.user.upsert({
    where: { email: 'selamawit@wegen.et' },
    update: {},
    create: {
      email: 'selamawit@wegen.et',
      passwordHash: await hash('DonorPass2026!'),
      firstName: 'Selamawit',
      lastName: 'Tadesse',
      phoneNumber: '+251911333333',
      isEmailVerified: true,
      roles: {
        create: [{ roleId: donorRole!.id }, { roleId: userRole!.id }],
      },
    },
  });

  const donor2 = await prisma.user.upsert({
    where: { email: 'dawit.donations@wegen.et' },
    update: {},
    create: {
      email: 'dawit.donations@wegen.et',
      passwordHash: await hash('DonorPass2026!'),
      firstName: 'Dawit',
      lastName: 'Kebede',
      phoneNumber: '+251911444444',
      isEmailVerified: true,
      roles: {
        create: [{ roleId: donorRole!.id }, { roleId: userRole!.id }],
      },
    },
  });

  // 3. Payout Account for Fundraiser
  const payoutAcct = await prisma.payoutAccount.create({
    data: {
      userId: fundraiser.id,
      type: 'BANK',
      bankName: 'Commercial Bank of Ethiopia',
      holderName: 'Abebe Bikila',
      encryptedAccountNumber: 'enc_1000123456789_cbe',
      last4: '6789',
      verifiedAt: new Date(),
    },
  });
  console.log('✅ PayoutAccount created: CBE ending in 6789');

  // 4. Fetch or ensure campaign exists
  let campaign = await prisma.campaign.findFirst({ where: { slug: 'help-chala-cardiac-surgery' } });
  if (!campaign) {
    const medCat = await prisma.category.findFirst();
    campaign = await prisma.campaign.create({
      data: {
        slug: 'help-chala-cardiac-surgery',
        title: 'Support Urgent Cardiac Surgery for 7-Year-Old Chala',
        story: 'Urgent surgery support.',
        categoryId: medCat!.id,
        location: 'Addis Ababa',
        goalCents: BigInt(35000000),
        raisedCents: BigInt(0),
        userId: fundraiser.id,
        status: CampaignStatus.PUBLISHED,
      },
    });
  }

  // 5. Seed Real Successful Donations with Gross, Fee (10%), Net, and Tip
  // Gross = amountCents. Fee = 10% of Gross. Net = Gross - Fee. Tips stored separately.
  const sampleDonations = [
    {
      donationReference: 'DON-2026-001',
      campaignId: campaign.id,
      donorUserId: donor1.id,
      donorName: 'Selamawit Tadesse',
      donorEmail: 'selamawit@wegen.et',
      donorPhone: '+251911333333',
      amountCents: BigInt(500000), // 5,000 ETB
      platformFeeCents: BigInt(50000), // 500 ETB (10%)
      netAmountCents: BigInt(450000), // 4,500 ETB
      tipAmountCents: BigInt(50000), // 500 ETB tip to WeGen
      status: DonationStatus.SUCCEEDED,
      paymentProvider: 'TELEBIRR',
      providerReferenceId: 'TB-98234123',
      isRecurring: false,
      createdAt: new Date('2026-02-10T11:30:00Z'),
    },
    {
      donationReference: 'DON-2026-002',
      campaignId: campaign.id,
      donorUserId: donor2.id,
      donorName: 'Dawit Kebede',
      donorEmail: 'dawit.donations@wegen.et',
      donorPhone: '+251911444444',
      amountCents: BigInt(1000000), // 10,000 ETB
      platformFeeCents: BigInt(100000), // 1,000 ETB (10%)
      netAmountCents: BigInt(900000), // 9,000 ETB
      tipAmountCents: BigInt(100000), // 1,000 ETB tip
      status: DonationStatus.SUCCEEDED,
      paymentProvider: 'CBE_BIRR',
      providerReferenceId: 'CBE-77182912',
      isRecurring: false,
      createdAt: new Date('2026-02-18T14:15:00Z'),
    },
    {
      donationReference: 'DON-2026-003',
      campaignId: campaign.id,
      donorUserId: null,
      donorName: 'Anonymous Donor',
      donorEmail: 'anon@diaspora.org',
      donorPhone: '+251911009988',
      isAnonymous: true,
      amountCents: BigInt(250000), // 2,500 ETB
      platformFeeCents: BigInt(25000), // 250 ETB (10%)
      netAmountCents: BigInt(225000), // 2,250 ETB
      tipAmountCents: BigInt(25000), // 250 ETB tip
      status: DonationStatus.SUCCEEDED,
      paymentProvider: 'CHAPA',
      providerReferenceId: 'CHAPA-66281934',
      isRecurring: true,
      createdAt: new Date('2026-03-05T09:45:00Z'),
    },
    {
      donationReference: 'DON-2026-004',
      campaignId: campaign.id,
      donorUserId: donor1.id,
      donorName: 'Selamawit Tadesse',
      donorEmail: 'selamawit@wegen.et',
      donorPhone: '+251911333333',
      amountCents: BigInt(750000), // 7,500 ETB
      platformFeeCents: BigInt(75000), // 750 ETB (10%)
      netAmountCents: BigInt(675000), // 6,750 ETB
      tipAmountCents: BigInt(75000), // 750 ETB tip
      status: DonationStatus.SUCCEEDED,
      paymentProvider: 'TELEBIRR',
      providerReferenceId: 'TB-99182374',
      isRecurring: false,
      createdAt: new Date('2026-03-22T16:20:00Z'),
    },
  ];

  for (const don of sampleDonations) {
    await prisma.donation.upsert({
      where: { donationReference: don.donationReference },
      update: don,
      create: don,
    });
  }
  console.log('✅ Seeded 4 strict compliant donations (Gross, 10% Fee, Net, Tips)');

  // 6. Seed a Paid Withdrawal to compute "Held for Causes = Net - Paid Withdrawals"
  await prisma.withdrawal.upsert({
    where: { reference: 'WTH-2026-001' },
    update: {},
    create: {
      reference: 'WTH-2026-001',
      campaignId: campaign.id,
      requestedByUserId: fundraiser.id,
      amountCents: BigInt(800000), // 8,000 ETB
      bankName: 'Commercial Bank of Ethiopia',
      accountNumber: '1000123456789',
      accountHolderName: 'Abebe Bikila',
      status: 'COMPLETED' as any,
      processedAt: new Date('2026-03-12T10:00:00Z'),
      createdAt: new Date('2026-03-10T12:00:00Z'),
    },
  });
  console.log('✅ Seeded Paid Withdrawal (8,000 ETB) to calculate Held for Causes');

  // 7. Seed an Audit ReportRun
  await prisma.reportRun.upsert({
    where: { reportNumber: 'REP-2026-0001' },
    update: {},
    create: {
      reportNumber: 'REP-2026-0001',
      type: 'STATEMENTS',
      filters: { range: 'Q1-2026' },
      generatedByUserId: superAdmin.id,
      rowCount: 4,
      totals: {
        grossEtb: 25000,
        feeEtb: 2500,
        netEtb: 22500,
        withdrawalsEtb: 8000,
        heldForCausesEtb: 14500,
        donors: 3,
      },
      fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
  });
  console.log('✅ Seeded ReportRun audit row REP-2026-0001');

  console.log('🎉 Phase 1 Database & Seed completely finalized!');
}

seedAccurateData()
  .catch((e) => {
    console.error('❌ Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
