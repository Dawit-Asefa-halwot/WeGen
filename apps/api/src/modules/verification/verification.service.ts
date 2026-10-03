import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../common/services/storage.service';
import { VerificationDecision, CampaignStatus, DocumentType } from '@prisma/client';
import { VerificationActionInput } from '@wegen/validation';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async getReviewQueue(status: CampaignStatus = CampaignStatus.SUBMITTED) {
    const campaigns = await this.prisma.campaign.findMany({
      where: { status },
      include: {
        category: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true } },
        beneficiary: true,
        referral: true,
        documents: true,
        organization: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Generate signed URLs for private verification documents
    return Promise.all(
      campaigns.map(async (c) => {
        const docsWithSignedUrls = await Promise.all(
          c.documents.map(async (doc) => ({
            id: doc.id,
            documentType: doc.documentType,
            originalFilename: doc.originalFilename,
            mimeType: doc.mimeType,
            signedUrl: await this.storageService.getSignedUrl(doc.storagePath),
            uploadedAt: doc.createdAt,
          }))
        );

        return {
          id: c.id,
          slug: c.slug,
          title: c.title,
          story: c.story,
          categoryName: c.category.name,
          location: c.location,
          goalEtb: Number(c.goalCents) / 100,
          campaignType: c.campaignType,
          status: c.status,
          isVerified: c.isVerified,
          creator: c.user,
          beneficiary: c.beneficiary,
          referral: c.referral,
          organization: c.organization,
          documents: docsWithSignedUrls,
          createdAt: c.createdAt,
        };
      })
    );
  }

  async processVerificationAction(dto: VerificationActionInput, reviewerUserId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: dto.campaignId } });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    let newStatus: CampaignStatus = campaign.status;
    let isVerified = campaign.isVerified;

    switch (dto.decision) {
      case 'APPROVE':
        newStatus = CampaignStatus.PUBLISHED; // Moves from VERIFIED to PUBLISHED
        isVerified = true;
        break;
      case 'REJECT':
        newStatus = CampaignStatus.REJECTED;
        isVerified = false;
        break;
      case 'REQUEST_MORE_INFO':
        newStatus = CampaignStatus.MORE_INFO_REQUIRED;
        break;
      case 'SUSPEND':
        newStatus = CampaignStatus.SUSPENDED;
        break;
      case 'FLAG':
        newStatus = CampaignStatus.FLAGGED;
        break;
    }

    const record = await this.prisma.$transaction(async (tx) => {
      // 1. Create verification record
      const rec = await tx.verificationRecord.create({
        data: {
          campaignId: campaign.id,
          reviewerUserId,
          decision: dto.decision as VerificationDecision,
          notes: dto.notes,
        },
      });

      // 2. Create verification event
      await tx.verificationEvent.create({
        data: {
          recordId: rec.id,
          previousStatus: campaign.status,
          newStatus,
          actorUserId: reviewerUserId,
          metadata: dto.requestedFields ? { requestedFields: dto.requestedFields } : undefined,
        },
      });

      // 3. Update campaign status
      await tx.campaign.update({
        where: { id: campaign.id },
        data: {
          status: newStatus,
          isVerified,
        },
      });

      return rec;
    });

    return {
      success: true,
      decision: dto.decision,
      newStatus,
      recordId: record.id,
    };
  }

  async uploadVerificationDocument(
    fileBuffer: Buffer,
    originalFilename: string,
    mimeType: string,
    documentType: DocumentType,
    userId: string,
    campaignId?: string,
    organizationId?: string
  ) {
    const { storagePath } = await this.storageService.uploadFile(
      fileBuffer,
      originalFilename,
      mimeType,
      true // private verification file
    );

    const doc = await this.prisma.document.create({
      data: {
        campaignId,
        organizationId,
        documentType,
        storagePath,
        originalFilename,
        mimeType,
        isPrivate: true,
        uploadedByUserId: userId,
      },
    });

    return {
      documentId: doc.id,
      documentType: doc.documentType,
      originalFilename: doc.originalFilename,
    };
  }
}
