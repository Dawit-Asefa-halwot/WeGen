import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('donations')
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  @Post()
  async createDonation(
    @Body() body: any,
    @CurrentUser('id') userId?: string,
  ) {
    return this.donationsService.createOneTimeDonation(body, userId);
  }

  @Get('campaign/:campaignId')
  async getCampaignDonations(
    @Param('campaignId') campaignId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.donationsService.getCampaignDonations(campaignId, limit ? Number(limit) : 20, offset ? Number(offset) : 0);
  }

  @Get('my-donations')
  @UseGuards(JwtAuthGuard)
  async getMyDonations(@CurrentUser('id') userId: string) {
    return this.donationsService.getUserDonations(userId);
  }

  @Get('receipt/:reference')
  async getReceipt(@Param('reference') reference: string) {
    return this.donationsService.getReceipt(reference);
  }
}
