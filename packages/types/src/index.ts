// Core Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  DONOR = 'DONOR',
  FUNDRAISER = 'FUNDRAISER',
  REFERRER = 'REFERRER',
  ORGANIZATION_ADMIN = 'ORGANIZATION_ADMIN',
  ORGANIZATION_MEMBER = 'ORGANIZATION_MEMBER'
}

export enum CampaignType {
  PERSONAL = 'PERSONAL',
  REFERRAL = 'REFERRAL',
  ORGANIZATION = 'ORGANIZATION'
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  MORE_INFO_REQUIRED = 'MORE_INFO_REQUIRED',
  VERIFIED = 'VERIFIED',
  PUBLISHED = 'PUBLISHED',
  FUNDING = 'FUNDING',
  WITHDRAWAL_REQUESTED = 'WITHDRAWAL_REQUESTED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
  FLAGGED = 'FLAGGED',
  CLOSED = 'CLOSED'
}

export enum DonationStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
}

export enum RecurringDonationStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PAYMENT_FAILED = 'PAYMENT_FAILED'
}

export enum RecurringFrequency {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export enum WithdrawalStatus {
  REQUESTED = 'REQUESTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum OrganizationSubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  TRIALING = 'TRIALING'
}

export enum VerificationDecision {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REQUEST_MORE_INFO = 'REQUEST_MORE_INFO',
  SUSPEND = 'SUSPEND',
  FLAG = 'FLAG'
}

export enum DocumentType {
  NATIONAL_ID = 'NATIONAL_ID',
  PASSPORT = 'PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  ORGANIZATION_REGISTRATION = 'ORGANIZATION_REGISTRATION',
  ORGANIZATION_TAX_CERT = 'ORGANIZATION_TAX_CERT',
  BENEFICIARY_CONSENT = 'BENEFICIARY_CONSENT',
  BANK_STATEMENT = 'BANK_STATEMENT',
  EVIDENCE_PHOTO = 'EVIDENCE_PHOTO',
  OTHER_SUPPORTING = 'OTHER_SUPPORTING'
}

// Financial interfaces (Amounts in integer minor units: e.g. 100 ETB = 10000 cents)
export interface FinancialBreakdown {
  grossAmountCents: number;
  platformFeeCents: number;
  paymentFeeCents: number;
  netAmountCents: number;
  platformFeePercentage: number;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  roles: UserRole[];
  createdAt: string;
}

export interface CampaignSummary {
  id: string;
  slug: string;
  title: string;
  story: string;
  categoryName: string;
  location: string;
  goalCents: number;
  raisedCents: number;
  supporterCount: number;
  coverImageUrl?: string;
  campaignType: CampaignType;
  status: CampaignStatus;
  isVerified: boolean;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  errors?: Record<string, string[]>;
}
