import {
  PrismaClient,
  UserRoleName,
  CampaignType,
  CampaignStatus,
  SubscriptionStatus,
  DocumentType,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log('🚀 Seeding comprehensive live data with media, videos, and bcrypt accounts...');

  // 1. Fetch or create roles
  const adminRole = await prisma.role.findUnique({ where: { name: UserRoleName.ADMIN } });
  const userRole = await prisma.role.findUnique({ where: { name: UserRoleName.USER } });
  const fundraiserRole = await prisma.role.findUnique({ where: { name: UserRoleName.FUNDRAISER } });
  const orgAdminRole = await prisma.role.findUnique({ where: { name: UserRoleName.ORGANIZATION_ADMIN } });
  const donorRole = await prisma.role.findUnique({ where: { name: UserRoleName.DONOR } });
  const referrerRole = await prisma.role.findUnique({ where: { name: UserRoleName.REFERRER } });

  // 2. Insert/Update Users with genuine bcrypt hashes for instant login
  const usersToSeed = [
    {
      email: 'admin@wegen.et',
      password: 'AdminWeGen2026!',
      firstName: 'WeGen',
      lastName: 'Platform Admin',
      phoneNumber: '+251911000000',
      roles: [adminRole!.id, userRole!.id],
    },
    {
      email: 'fundraiser@wegen.et',
      password: 'Fundraiser2026!',
      firstName: 'Abebe',
      lastName: 'Bikila',
      phoneNumber: '+251911111111',
      roles: [fundraiserRole!.id, userRole!.id],
    },
    {
      email: 'contact@redcross.et',
      password: 'OrgPass2026!',
      firstName: 'Ethiopian',
      lastName: 'Red Cross',
      phoneNumber: '+251911222222',
      roles: [orgAdminRole!.id, userRole!.id],
    },
    {
      email: 'donor@wegen.et',
      password: 'DonorPass2026!',
      firstName: 'Selamawit',
      lastName: 'Tadesse',
      phoneNumber: '+251911333333',
      roles: [donorRole!.id, userRole!.id],
    },
    {
      email: 'referrer@wegen.et',
      password: 'ReferrerPass2026!',
      firstName: 'Dawit',
      lastName: 'Kebede',
      phoneNumber: '+251911444444',
      roles: [referrerRole!.id, userRole!.id],
    },
  ];

  const seededUsers: Record<string, any> = {};

  for (const u of usersToSeed) {
    const passwordHash = await hashPassword(u.password);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        passwordHash,
        firstName: u.firstName,
        lastName: u.lastName,
        phoneNumber: u.phoneNumber,
        isEmailVerified: true,
      },
      create: {
        email: u.email,
        passwordHash,
        firstName: u.firstName,
        lastName: u.lastName,
        phoneNumber: u.phoneNumber,
        isEmailVerified: true,
        roles: {
          create: u.roles.map((roleId) => ({ roleId })),
        },
      },
    });
    seededUsers[u.email] = user;
    console.log(`👤 User ready: ${u.email} (Password: ${u.password})`);
  }

  // 3. Organization: Ethiopian Red Cross Society & Mekedonia
  const orgRedCross = await prisma.organization.upsert({
    where: { slug: 'ethiopian-red-cross' },
    update: {
      isVerified: true,
      status: 'ACTIVE',
    },
    create: {
      name: 'Ethiopian Red Cross Society',
      slug: 'ethiopian-red-cross',
      registrationNumber: 'NGO-ETH-1935',
      category: 'Humanitarian Charity',
      contactEmail: 'contact@redcross.et',
      contactPhone: '+251911222222',
      website: 'https://redcrosseth.org',
      description: 'Humanitarian organization serving communities across Ethiopia in emergency response, healthcare, and disaster relief.',
      logoUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
      status: 'ACTIVE',
      members: {
        create: [{ userId: seededUsers['contact@redcross.et'].id, role: 'ADMIN' }],
      },
    },
  });

  // 4. Categories
  const medicalCat = await prisma.category.findUnique({ where: { slug: 'medical' } });
  const emergencyCat = await prisma.category.findUnique({ where: { slug: 'emergency' } });
  const educationCat = await prisma.category.findUnique({ where: { slug: 'education' } });
  const childrenCat = await prisma.category.findUnique({ where: { slug: 'children' } });

  // 5. Campaigns with Videos and Media Records
  const campaignsData = [
    {
      slug: 'help-chala-cardiac-surgery',
      title: 'Support Urgent Cardiac Surgery for 7-Year-Old Chala',
      story: `Chala is a bright, cheerful 7-year-old boy from Hawassa diagnosed with a complex congenital heart defect. He requires urgent open-heart surgery at Tikur Anbessa Hospital (or abroad if specialized bypass is necessary). 
      
His family has depleted their life savings over months of treatments and diagnostics. Every contribution brings Chala one step closer to a healthy heart, playtime with his friends, and a long life. Thank you for your generosity and prayers.`,
      categoryId: medicalCat!.id,
      location: 'Hawassa / Addis Ababa, Ethiopia',
      goalCents: BigInt(35000000), // 350,000 ETB
      raisedCents: BigInt(21850000), // 218,500 ETB
      supporterCount: 46,
      coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      campaignType: CampaignType.PERSONAL,
      status: CampaignStatus.PUBLISHED,
      isVerified: true,
      userId: seededUsers['fundraiser@wegen.et'].id,
      beneficiary: {
        name: 'Chala Bikila',
        phone: '+251911111111',
        relationshipToCreator: 'Son',
        isReferralBeneficiary: false,
        bankName: 'Commercial Bank of Ethiopia',
        accountNumber: '1000123456789',
        accountHolderName: 'Abebe Bikila',
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
          type: 'IMAGE',
          caption: 'Chala at Tikur Anbessa Hospital Cardiology Unit',
          isPrimary: true,
        },
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          type: 'VIDEO',
          caption: "Doctor's evaluation and family plea video",
          isPrimary: false,
        },
        {
          url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
          type: 'IMAGE',
          caption: 'Medical evaluation record and admission voucher',
          isPrimary: false,
        },
      ],
      updates: [
        {
          title: 'Pre-surgery Evaluation Completed',
          content: 'The surgical team has finalized Chala’s bloodwork and pre-operative chest scans. We are now 62% towards the total required deposit.',
        },
      ],
    },
    {
      slug: 'clean-water-initiative-somali-region',
      title: 'Emergency Clean Water & Solar Borehole Construction in Somali Region',
      story: `Prolonged drought across parts of the Somali regional state has drained local water pans and wells, leaving more than 2,400 pastoral families without safe drinking water. 

The Ethiopian Red Cross Society is actively dispatching emergency water trucks while drilling two high-capacity solar borehole wells. Each well will provide clean, reliable water for drinking, livestock, and community sanitation for years to come.`,
      categoryId: emergencyCat!.id,
      location: 'Jijiga, Somali Region, Ethiopia',
      goalCents: BigInt(85000000), // 850,000 ETB
      raisedCents: BigInt(57400000), // 574,000 ETB
      supporterCount: 168,
      coverImageUrl: 'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?w=1200&auto=format&fit=crop&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      campaignType: CampaignType.ORGANIZATION,
      status: CampaignStatus.PUBLISHED,
      isVerified: true,
      userId: seededUsers['contact@redcross.et'].id,
      organizationId: orgRedCross.id,
      beneficiary: {
        name: 'Somali Region Rural Communities',
        isReferralBeneficiary: false,
        bankName: 'Commercial Bank of Ethiopia',
        accountNumber: '1000999888777',
        accountHolderName: 'Ethiopian Red Cross Society',
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?w=1200&auto=format&fit=crop&q=80',
          type: 'IMAGE',
          caption: 'Current drought condition and emergency water dispatch in Jijiga',
          isPrimary: true,
        },
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          type: 'VIDEO',
          caption: 'Field documentation: Clean water drilling site inspection',
          isPrimary: false,
        },
        {
          url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80',
          type: 'IMAGE',
          caption: 'Solar pumping system schematics and equipment setup',
          isPrimary: false,
        },
      ],
      updates: [
        {
          title: 'Borehole Drilling Rig Has Arrived on Site',
          content: 'The heavy drilling machinery has been transported to Jijiga and soil excavation began this morning.',
        },
      ],
    },
    {
      slug: 'rural-school-library-and-computer-lab',
      title: 'Equip Debre Sina High School with Digital Library & Computers',
      story: `Over 800 high school students in Debre Sina currently share fewer than 40 textbook copies and have never used a personal computer. 

This campaign funds 25 refurbished desktop computers, offline encyclopedia servers (Kiwix/Wikipedia), solar battery backup, and 500 science and mathematics textbooks to give these students the future they deserve.`,
      categoryId: educationCat!.id,
      location: 'Debre Sina, Amhara Region, Ethiopia',
      goalCents: BigInt(45000000), // 450,000 ETB
      raisedCents: BigInt(29500000), // 295,000 ETB
      supporterCount: 89,
      coverImageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      campaignType: CampaignType.REFERRAL,
      status: CampaignStatus.PUBLISHED,
      isVerified: true,
      userId: seededUsers['referrer@wegen.et'].id,
      beneficiary: {
        name: 'Debre Sina High School Students & Parent Committee',
        phone: '+251911444444',
        relationshipToCreator: 'School Committee Representative',
        isReferralBeneficiary: true,
        bankName: 'Dashen Bank',
        accountNumber: '500012398711',
        accountHolderName: 'Debre Sina High School Development Fund',
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
          type: 'IMAGE',
          caption: 'Students studying in the current under-resourced classroom',
          isPrimary: true,
        },
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          type: 'VIDEO',
          caption: 'School principal and teacher interview on student needs',
          isPrimary: false,
        },
      ],
      updates: [
        {
          title: 'First Batch of 10 Laptops Pledged',
          content: 'A diaspora alumni group in Washington DC has pledged to match our local contributions for the solar inverter!',
        },
      ],
    },
  ];

  for (const c of campaignsData) {
    const existing = await prisma.campaign.findUnique({ where: { slug: c.slug } });
    if (existing) {
      await prisma.campaign.update({
        where: { slug: c.slug },
        data: {
          title: c.title,
          story: c.story,
          coverImageUrl: c.coverImageUrl,
          videoUrl: c.videoUrl,
          goalCents: c.goalCents,
          raisedCents: c.raisedCents,
          supporterCount: c.supporterCount,
        },
      });
      // Delete old media and replace with rich media
      await prisma.campaignMedia.deleteMany({ where: { campaignId: existing.id } });
      for (const m of c.media) {
        await prisma.campaignMedia.create({
          data: {
            campaignId: existing.id,
            url: m.url,
            type: m.type,
            caption: m.caption,
            isPrimary: m.isPrimary,
          },
        });
      }
      console.log(`📌 Campaign updated with media & video: ${c.slug}`);
    } else {
      const created = await prisma.campaign.create({
        data: {
          slug: c.slug,
          title: c.title,
          story: c.story,
          categoryId: c.categoryId,
          location: c.location,
          goalCents: c.goalCents,
          raisedCents: c.raisedCents,
          supporterCount: c.supporterCount,
          coverImageUrl: c.coverImageUrl,
          videoUrl: c.videoUrl,
          campaignType: c.campaignType,
          status: c.status,
          isVerified: c.isVerified,
          userId: c.userId,
          organizationId: c.organizationId,
          beneficiary: {
            create: c.beneficiary,
          },
          media: {
            create: c.media,
          },
          updates: {
            create: c.updates,
          },
        },
      });
      console.log(`✨ Created new campaign with video: ${c.slug}`);
    }
  }

  // 6. Seed verification documents for compliance check
  const firstCampaign = await prisma.campaign.findUnique({ where: { slug: 'help-chala-cardiac-surgery' } });
  if (firstCampaign) {
    const docExists = await prisma.document.findFirst({ where: { campaignId: firstCampaign.id } });
    if (!docExists) {
      await prisma.document.create({
        data: {
          campaignId: firstCampaign.id,
          documentType: DocumentType.MEDICAL_RECORD,
          storagePath: 'private/sample_medical_diagnosis_cardiac.pdf',
          originalFilename: 'Tikur_Anbessa_Hospital_Echo_Diagnosis.pdf',
          mimeType: 'application/pdf',
          isPrivate: true,
          uploadedByUserId: seededUsers['fundraiser@wegen.et'].id,
          verifiedAt: new Date(),
        },
      });
      console.log('📄 Verification document attached to campaign');
    }
  }

  console.log('🎉 Comprehensive database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
