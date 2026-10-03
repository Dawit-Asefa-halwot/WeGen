import { z } from 'zod';
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phoneNumber: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string | undefined;
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const PasswordResetRequestSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const PasswordResetConfirmSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    newPassword: string;
}, {
    token: string;
    newPassword: string;
}>;
export declare const CreateCampaignSchema: z.ZodObject<{
    title: z.ZodString;
    story: z.ZodString;
    categoryId: z.ZodString;
    location: z.ZodString;
    goalEtb: z.ZodNumber;
    coverImageUrl: z.ZodOptional<z.ZodString>;
    videoUrl: z.ZodOptional<z.ZodString>;
    beneficiaryName: z.ZodOptional<z.ZodString>;
    beneficiaryPhone: z.ZodOptional<z.ZodString>;
    beneficiaryRelationship: z.ZodOptional<z.ZodString>;
    isReferral: z.ZodDefault<z.ZodBoolean>;
    referralReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    story: string;
    categoryId: string;
    location: string;
    goalEtb: number;
    isReferral: boolean;
    coverImageUrl?: string | undefined;
    videoUrl?: string | undefined;
    beneficiaryName?: string | undefined;
    beneficiaryPhone?: string | undefined;
    beneficiaryRelationship?: string | undefined;
    referralReason?: string | undefined;
}, {
    title: string;
    story: string;
    categoryId: string;
    location: string;
    goalEtb: number;
    coverImageUrl?: string | undefined;
    videoUrl?: string | undefined;
    beneficiaryName?: string | undefined;
    beneficiaryPhone?: string | undefined;
    beneficiaryRelationship?: string | undefined;
    isReferral?: boolean | undefined;
    referralReason?: string | undefined;
}>;
export declare const UpdateCampaignSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    story: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    goalEtb: z.ZodOptional<z.ZodNumber>;
    coverImageUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    videoUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    beneficiaryName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    beneficiaryPhone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    beneficiaryRelationship: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isReferral: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    referralReason: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    story?: string | undefined;
    categoryId?: string | undefined;
    location?: string | undefined;
    goalEtb?: number | undefined;
    coverImageUrl?: string | undefined;
    videoUrl?: string | undefined;
    beneficiaryName?: string | undefined;
    beneficiaryPhone?: string | undefined;
    beneficiaryRelationship?: string | undefined;
    isReferral?: boolean | undefined;
    referralReason?: string | undefined;
}, {
    title?: string | undefined;
    story?: string | undefined;
    categoryId?: string | undefined;
    location?: string | undefined;
    goalEtb?: number | undefined;
    coverImageUrl?: string | undefined;
    videoUrl?: string | undefined;
    beneficiaryName?: string | undefined;
    beneficiaryPhone?: string | undefined;
    beneficiaryRelationship?: string | undefined;
    isReferral?: boolean | undefined;
    referralReason?: string | undefined;
}>;
export declare const OneTimeDonationSchema: z.ZodObject<{
    campaignId: z.ZodString;
    amountEtb: z.ZodNumber;
    isAnonymous: z.ZodDefault<z.ZodBoolean>;
    donorName: z.ZodOptional<z.ZodString>;
    donorEmail: z.ZodOptional<z.ZodString>;
    donorPhone: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    paymentProvider: z.ZodDefault<z.ZodEnum<["CHAPA", "TELEBIRR", "CBE_BIRR", "STRIPE", "MOCK"]>>;
}, "strip", z.ZodTypeAny, {
    campaignId: string;
    amountEtb: number;
    isAnonymous: boolean;
    paymentProvider: "CHAPA" | "TELEBIRR" | "CBE_BIRR" | "STRIPE" | "MOCK";
    message?: string | undefined;
    donorName?: string | undefined;
    donorEmail?: string | undefined;
    donorPhone?: string | undefined;
}, {
    campaignId: string;
    amountEtb: number;
    message?: string | undefined;
    isAnonymous?: boolean | undefined;
    donorName?: string | undefined;
    donorEmail?: string | undefined;
    donorPhone?: string | undefined;
    paymentProvider?: "CHAPA" | "TELEBIRR" | "CBE_BIRR" | "STRIPE" | "MOCK" | undefined;
}>;
export declare const RecurringDonationSchema: z.ZodObject<{
    campaignId: z.ZodOptional<z.ZodString>;
    causeCategoryId: z.ZodOptional<z.ZodString>;
    amountEtb: z.ZodNumber;
    frequency: z.ZodDefault<z.ZodEnum<["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]>>;
    donorEmail: z.ZodString;
    donorName: z.ZodString;
    paymentProvider: z.ZodDefault<z.ZodEnum<["CHAPA", "TELEBIRR", "CBE_BIRR", "STRIPE", "MOCK"]>>;
}, "strip", z.ZodTypeAny, {
    amountEtb: number;
    donorName: string;
    donorEmail: string;
    paymentProvider: "CHAPA" | "TELEBIRR" | "CBE_BIRR" | "STRIPE" | "MOCK";
    frequency: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
    campaignId?: string | undefined;
    causeCategoryId?: string | undefined;
}, {
    amountEtb: number;
    donorName: string;
    donorEmail: string;
    campaignId?: string | undefined;
    paymentProvider?: "CHAPA" | "TELEBIRR" | "CBE_BIRR" | "STRIPE" | "MOCK" | undefined;
    causeCategoryId?: string | undefined;
    frequency?: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY" | undefined;
}>;
export declare const CreateWithdrawalSchema: z.ZodObject<{
    campaignId: z.ZodString;
    amountEtb: z.ZodNumber;
    bankName: z.ZodString;
    accountNumber: z.ZodString;
    accountHolderName: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    campaignId: string;
    amountEtb: number;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    notes?: string | undefined;
}, {
    campaignId: string;
    amountEtb: number;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    notes?: string | undefined;
}>;
export declare const RegisterOrganizationSchema: z.ZodObject<{
    name: z.ZodString;
    registrationNumber: z.ZodString;
    category: z.ZodString;
    contactEmail: z.ZodString;
    contactPhone: z.ZodString;
    website: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    address: z.ZodString;
    subscriptionPlanId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    registrationNumber: string;
    category: string;
    contactEmail: string;
    contactPhone: string;
    description: string;
    address: string;
    subscriptionPlanId: string;
    website?: string | undefined;
}, {
    name: string;
    registrationNumber: string;
    category: string;
    contactEmail: string;
    contactPhone: string;
    description: string;
    address: string;
    subscriptionPlanId: string;
    website?: string | undefined;
}>;
export declare const VerificationActionSchema: z.ZodObject<{
    campaignId: z.ZodString;
    decision: z.ZodEnum<["APPROVE", "REJECT", "REQUEST_MORE_INFO", "SUSPEND", "FLAG"]>;
    notes: z.ZodString;
    requestedFields: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    campaignId: string;
    notes: string;
    decision: "APPROVE" | "REJECT" | "REQUEST_MORE_INFO" | "SUSPEND" | "FLAG";
    requestedFields?: string[] | undefined;
}, {
    campaignId: string;
    notes: string;
    decision: "APPROVE" | "REJECT" | "REQUEST_MORE_INFO" | "SUSPEND" | "FLAG";
    requestedFields?: string[] | undefined;
}>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateCampaignInput = z.infer<typeof CreateCampaignSchema>;
export type OneTimeDonationInput = z.infer<typeof OneTimeDonationSchema>;
export type RecurringDonationInput = z.infer<typeof RecurringDonationSchema>;
export type CreateWithdrawalInput = z.infer<typeof CreateWithdrawalSchema>;
export type RegisterOrganizationInput = z.infer<typeof RegisterOrganizationSchema>;
export type VerificationActionInput = z.infer<typeof VerificationActionSchema>;
