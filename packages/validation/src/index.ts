import { z } from 'zod';

// Auth Schemas
export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  phoneNumber: z.string().optional()
});

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' })
});

export const PasswordResetRequestSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' })
});

export const PasswordResetConfirmSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' })
});

// Campaign Schemas
export const CreateCampaignSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(150),
  story: z.string().min(20, { message: 'Story must be at least 20 characters' }),
  categoryId: z.string().uuid({ message: 'Valid category is required' }),
  location: z.string().min(2, { message: 'Location is required' }),
  goalEtb: z.number().positive({ message: 'Goal must be greater than 0 ETB' }),
  coverImageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  
  // Beneficiary Info
  beneficiaryName: z.string().optional(),
  beneficiaryPhone: z.string().optional(),
  beneficiaryRelationship: z.string().optional(),
  isReferral: z.boolean().default(false),
  referralReason: z.string().optional()
});

export const UpdateCampaignSchema = CreateCampaignSchema.partial();

// Donation Schemas
export const OneTimeDonationSchema = z.object({
  campaignId: z.string().uuid({ message: 'Valid campaign ID is required' }),
  amountEtb: z.number().min(10, { message: 'Minimum donation is 10 ETB' }),
  isAnonymous: z.boolean().default(false),
  donorName: z.string().optional(),
  donorEmail: z.string().email().optional(),
  donorPhone: z.string().optional(),
  message: z.string().max(500).optional(),
  paymentProvider: z.enum(['CHAPA', 'TELEBIRR', 'CBE_BIRR', 'STRIPE', 'MOCK']).default('CHAPA')
});

export const RecurringDonationSchema = z.object({
  campaignId: z.string().uuid().optional(),
  causeCategoryId: z.string().uuid().optional(),
  amountEtb: z.number().min(50, { message: 'Minimum recurring donation is 50 ETB' }),
  frequency: z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']).default('MONTHLY'),
  donorEmail: z.string().email({ message: 'Valid email required' }),
  donorName: z.string().min(2, { message: 'Donor name required' }),
  paymentProvider: z.enum(['CHAPA', 'TELEBIRR', 'CBE_BIRR', 'STRIPE', 'MOCK']).default('CHAPA')
});

// Withdrawal Request Schema
export const CreateWithdrawalSchema = z.object({
  campaignId: z.string().uuid({ message: 'Valid campaign ID is required' }),
  amountEtb: z.number().positive({ message: 'Withdrawal amount must be positive' }),
  bankName: z.string().min(2, { message: 'Bank name is required' }),
  accountNumber: z.string().min(5, { message: 'Account number is required' }),
  accountHolderName: z.string().min(2, { message: 'Account holder name is required' }),
  notes: z.string().optional()
});

// Organization Registration Schema
export const RegisterOrganizationSchema = z.object({
  name: z.string().min(3, { message: 'Organization name is required' }),
  registrationNumber: z.string().min(2, { message: 'Registration number is required' }),
  category: z.string().min(2, { message: 'Organization category required' }),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
  website: z.string().url().optional(),
  description: z.string().min(20),
  address: z.string().min(5),
  subscriptionPlanId: z.string().uuid({ message: 'Selected subscription plan is required' })
});

// Verification Decision Schema
export const VerificationActionSchema = z.object({
  campaignId: z.string().uuid(),
  decision: z.enum(['APPROVE', 'REJECT', 'REQUEST_MORE_INFO', 'SUSPEND', 'FLAG']),
  notes: z.string().min(5, { message: 'Detailed verification notes are required' }),
  requestedFields: z.array(z.string()).optional()
});

// Export types inferred from schemas
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateCampaignInput = z.infer<typeof CreateCampaignSchema>;
export type OneTimeDonationInput = z.infer<typeof OneTimeDonationSchema>;
export type RecurringDonationInput = z.infer<typeof RecurringDonationSchema>;
export type CreateWithdrawalInput = z.infer<typeof CreateWithdrawalSchema>;
export type RegisterOrganizationInput = z.infer<typeof RegisterOrganizationSchema>;
export type VerificationActionInput = z.infer<typeof VerificationActionSchema>;
