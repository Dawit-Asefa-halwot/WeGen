import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { VerificationModule } from './modules/verification/verification.module';
import { DonationsModule } from './modules/donations/donations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { WithdrawalsModule } from './modules/withdrawals/withdrawals.module';
import { AdminModule } from './modules/admin/admin.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    CampaignsModule,
    VerificationModule,
    DonationsModule,
    PaymentsModule,
    OrganizationsModule,
    WithdrawalsModule,
    AdminModule,
    StorageModule,
  ],
})
export class AppModule {}
