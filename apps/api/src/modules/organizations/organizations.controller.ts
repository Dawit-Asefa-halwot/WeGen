import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('organizations')
export class OrganizationsController {
  constructor(private orgsService: OrganizationsService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  async register(
    @Body() body: any,
    @CurrentUser('id') userId: string
  ) {
    return this.orgsService.registerOrganization(body, userId);
  }

  @Get('plans')
  async getPlans() {
    return this.orgsService.getSubscriptionPlans();
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.orgsService.getOrganizationBySlug(slug);
  }
}
