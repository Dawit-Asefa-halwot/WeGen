import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../auth/rbac.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleName } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RbacGuard)
@Roles(UserRoleName.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('overview')
  async getOverview() {
    return this.adminService.getDashboardOverview();
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
