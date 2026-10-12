import { Controller, Get, Post, Query, Body, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleName } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RbacGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('overview')
  async getOverview() {
    return this.adminService.getDashboardOverview();
  }

  /**
   * GET /admin/analytics?from&to&range=7|14|30
   */
  @Get('analytics')
  async getAnalytics(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('range') range?: number,
  ) {
    return this.adminService.getAnalytics(from, to, range ? Number(range) : 14);
  }

  /**
   * GET /admin/reports/statements?from&to&q
   */
  @Get('reports/statements')
  async getStatements(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('q') q?: string,
  ) {
    return this.adminService.getStatements(from, to, q);
  }

  /**
   * GET /admin/reports/:type?from&to&q&page&limit
   */
  @Get('reports/:type')
  async getReportByType(
    @Query('type') type: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('q') q?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getReportByType(
      type,
      from,
      to,
      q,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  /**
   * POST /admin/reports/export
   */
  @Post('reports/export')
  async exportReport(
    @Body('type') type: string,
    @Body('filters') filters: any,
    @Req() req: any,
  ) {
    const actorUserId = req.user?.userId || req.user?.id || 'admin-user';
    return this.adminService.exportReport(type, filters, actorUserId);
  }

  @Get('users')
  async getUsers(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getUsersList(page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Get('audit-logs')
  async getAuditLogs(@Query('limit') limit?: number) {
    return this.adminService.getAuditLogs(limit ? Number(limit) : 50);
  }
}
