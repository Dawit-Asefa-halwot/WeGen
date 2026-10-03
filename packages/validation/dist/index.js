"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationActionSchema = exports.RegisterOrganizationSchema = exports.CreateWithdrawalSchema = exports.RecurringDonationSchema = exports.OneTimeDonationSchema = exports.UpdateCampaignSchema = exports.CreateCampaignSchema = exports.PasswordResetConfirmSchema = exports.PasswordResetRequestSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
// Auth Schemas
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Invalid email address' }),
    password: zod_1.z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    firstName: zod_1.z.string().min(2, { message: 'First name is required' }),
    lastName: zod_1.z.string().min(2, { message: 'Last name is required' }),
    phoneNumber: zod_1.z.string().optional()
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Invalid email address' }),
    password: zod_1.z.string().min(1, { message: 'Password is required' })
});
exports.PasswordResetRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Invalid email address' })
});
exports.PasswordResetConfirmSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, { message: 'Reset token is required' }),
    newPassword: zod_1.z.string().min(8, { message: 'Password must be at least 8 characters long' })
});
// Campaign Schemas
exports.CreateCampaignSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, { message: 'Title must be at least 5 characters' }).max(150),
    story: zod_1.z.string().min(20, { message: 'Story must be at least 20 characters' }),
    categoryId: zod_1.z.string().uuid({ message: 'Valid category is required' }),
    location: zod_1.z.string().min(2, { message: 'Location is required' }),
    goalEtb: zod_1.z.number().positive({ message: 'Goal must be greater than 0 ETB' }),
    coverImageUrl: zod_1.z.string().url().optional(),
    videoUrl: zod_1.z.string().url().optional(),
    // Beneficiary Info
    beneficiaryName: zod_1.z.string().optional(),
    beneficiaryPhone: zod_1.z.string().optional(),
    beneficiaryRelationship: zod_1.z.string().optional(),
    isReferral: zod_1.z.boolean().default(false),
    referralReason: zod_1.z.string().optional()
});
exports.UpdateCampaignSchema = exports.CreateCampaignSchema.partial();
// Donation Schemas
exports.OneTimeDonationSchema = zod_1.z.object({
    campaignId: zod_1.z.string().uuid({ message: 'Valid campaign ID is required' }),
    amountEtb: zod_1.z.number().min(10, { message: 'Minimum donation is 10 ETB' }),
    isAnonymous: zod_1.z.boolean().default(false),
    donorName: zod_1.z.string().optional(),
    donorEmail: zod_1.z.string().email().optional(),
    donorPhone: zod_1.z.string().optional(),
    message: zod_1.z.string().max(500).optional(),
    paymentProvider: zod_1.z.enum(['CHAPA', 'TELEBIRR', 'CBE_BIRR', 'STRIPE', 'MOCK']).default('CHAPA')
});
exports.RecurringDonationSchema = zod_1.z.object({
    campaignId: zod_1.z.string().uuid().optional(),
    causeCategoryId: zod_1.z.string().uuid().optional(),
    amountEtb: zod_1.z.number().min(50, { message: 'Minimum recurring donation is 50 ETB' }),
    frequency: zod_1.z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']).default('MONTHLY'),
    donorEmail: zod_1.z.string().email({ message: 'Valid email required' }),
    donorName: zod_1.z.string().min(2, { message: 'Donor name required' }),
    paymentProvider: zod_1.z.enum(['CHAPA', 'TELEBIRR', 'CBE_BIRR', 'STRIPE', 'MOCK']).default('CHAPA')
});
// Withdrawal Request Schema
exports.CreateWithdrawalSchema = zod_1.z.object({
    campaignId: zod_1.z.string().uuid({ message: 'Valid campaign ID is required' }),
    amountEtb: zod_1.z.number().positive({ message: 'Withdrawal amount must be positive' }),
    bankName: zod_1.z.string().min(2, { message: 'Bank name is required' }),
    accountNumber: zod_1.z.string().min(5, { message: 'Account number is required' }),
    accountHolderName: zod_1.z.string().min(2, { message: 'Account holder name is required' }),
    notes: zod_1.z.string().optional()
});
// Organization Registration Schema
exports.RegisterOrganizationSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, { message: 'Organization name is required' }),
    registrationNumber: zod_1.z.string().min(2, { message: 'Registration number is required' }),
    category: zod_1.z.string().min(2, { message: 'Organization category required' }),
    contactEmail: zod_1.z.string().email(),
    contactPhone: zod_1.z.string().min(5),
    website: zod_1.z.string().url().optional(),
    description: zod_1.z.string().min(20),
    address: zod_1.z.string().min(5),
    subscriptionPlanId: zod_1.z.string().uuid({ message: 'Selected subscription plan is required' })
});
// Verification Decision Schema
exports.VerificationActionSchema = zod_1.z.object({
    campaignId: zod_1.z.string().uuid(),
    decision: zod_1.z.enum(['APPROVE', 'REJECT', 'REQUEST_MORE_INFO', 'SUSPEND', 'FLAG']),
    notes: zod_1.z.string().min(5, { message: 'Detailed verification notes are required' }),
    requestedFields: zod_1.z.array(zod_1.z.string()).optional()
});
