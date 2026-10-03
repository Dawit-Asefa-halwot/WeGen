import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCampaign(
    @Body() body: any,
    @CurrentUser('id') userId: string,
  ) {
    return this.campaignsService.createCampaign(body, userId, body.organizationId);
  }

  @Get('discover')
  async discoverCampaigns(@Query() query: any) {
    return this.campaignsService.discoverCampaigns(query);
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.campaignsService.getCampaignBySlug(slug);
  }

  @Get('my-campaigns')
  @UseGuards(JwtAuthGuard)
  async getMyCampaigns(@CurrentUser('id') userId: string) {
    return this.campaignsService.getUserCampaigns(userId);
  }

  @Post(':id/updates')
  @UseGuards(JwtAuthGuard)
  async addUpdate(
    @Param('id') campaignId: string,
    @CurrentUser('id') userId: string,
    @Body() body: { title: string; content: string }
  ) {
    return this.campaignsService.addCampaignUpdate(campaignId, userId, body.title, body.content);
  }
}
