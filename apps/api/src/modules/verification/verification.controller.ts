import { Controller, Get, Post, Body, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRoleName, CampaignStatus, DocumentType } from '@prisma/client';

@Controller('verification')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @Get('queue')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles(UserRoleName.ADMIN)
  async getQueue(@Query('status') status?: CampaignStatus) {
    return this.verificationService.getReviewQueue(status || CampaignStatus.SUBMITTED);
  }

  @Post('action')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles(UserRoleName.ADMIN)
  async processAction(
    @Body() body: any,
    @CurrentUser('id') adminUserId: string
  ) {
    return this.verificationService.processVerificationAction(body, adminUserId);
  }

  @Post('document/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType: DocumentType,
    @Body('campaignId') campaignId?: string,
    @Body('organizationId') organizationId?: string,
    @CurrentUser('id') userId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No document file uploaded');
    }
    return this.verificationService.uploadVerificationDocument(
      file.buffer,
      file.originalname,
      file.mimetype,
      documentType || DocumentType.OTHER_SUPPORTING,
      userId!,
      campaignId,
      organizationId
    );
  }
}
