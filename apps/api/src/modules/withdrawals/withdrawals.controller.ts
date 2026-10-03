import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRoleName, WithdrawalStatus } from '@prisma/client';

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private withdrawalsService: WithdrawalsService) {}

  @Post('request')
  @UseGuards(JwtAuthGuard)
  async createRequest(
    @Body() body: any,
    @CurrentUser('id') userId: string,
  ) {
    return this.withdrawalsService.createWithdrawalRequest(body, userId);
  }

  @Get('admin/queue')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles(UserRoleName.ADMIN)
  async getAdminQueue(@Query('status') status?: WithdrawalStatus) {
    return this.withdrawalsService.getWithdrawalQueue(status);
  }

  @Post('admin/review')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles(UserRoleName.ADMIN)
  async reviewWithdrawal(
    @Body() body: { withdrawalId: string; decision: 'APPROVE' | 'REJECT'; notes: string },
    @CurrentUser('id') adminUserId: string
  ) {
    return this.withdrawalsService.reviewWithdrawal(body.withdrawalId, body.decision, body.notes, adminUserId);
  }
}
