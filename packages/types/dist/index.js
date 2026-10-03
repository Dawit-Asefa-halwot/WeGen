"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentType = exports.VerificationDecision = exports.OrganizationSubscriptionStatus = exports.WithdrawalStatus = exports.RecurringFrequency = exports.RecurringDonationStatus = exports.DonationStatus = exports.CampaignStatus = exports.CampaignType = exports.UserRole = void 0;
// Core Enums
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["USER"] = "USER";
    UserRole["DONOR"] = "DONOR";
    UserRole["FUNDRAISER"] = "FUNDRAISER";
    UserRole["REFERRER"] = "REFERRER";
    UserRole["ORGANIZATION_ADMIN"] = "ORGANIZATION_ADMIN";
    UserRole["ORGANIZATION_MEMBER"] = "ORGANIZATION_MEMBER";
})(UserRole || (exports.UserRole = UserRole = {}));
var CampaignType;
(function (CampaignType) {
    CampaignType["PERSONAL"] = "PERSONAL";
    CampaignType["REFERRAL"] = "REFERRAL";
    CampaignType["ORGANIZATION"] = "ORGANIZATION";
})(CampaignType || (exports.CampaignType = CampaignType = {}));
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "DRAFT";
    CampaignStatus["SUBMITTED"] = "SUBMITTED";
    CampaignStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    CampaignStatus["MORE_INFO_REQUIRED"] = "MORE_INFO_REQUIRED";
    CampaignStatus["VERIFIED"] = "VERIFIED";
    CampaignStatus["PUBLISHED"] = "PUBLISHED";
    CampaignStatus["FUNDING"] = "FUNDING";
    CampaignStatus["WITHDRAWAL_REQUESTED"] = "WITHDRAWAL_REQUESTED";
    CampaignStatus["COMPLETED"] = "COMPLETED";
    CampaignStatus["REJECTED"] = "REJECTED";
    CampaignStatus["SUSPENDED"] = "SUSPENDED";
    CampaignStatus["FLAGGED"] = "FLAGGED";
    CampaignStatus["CLOSED"] = "CLOSED";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
var DonationStatus;
(function (DonationStatus) {
    DonationStatus["PENDING"] = "PENDING";
    DonationStatus["PROCESSING"] = "PROCESSING";
    DonationStatus["SUCCEEDED"] = "SUCCEEDED";
    DonationStatus["FAILED"] = "FAILED";
    DonationStatus["CANCELLED"] = "CANCELLED";
    DonationStatus["REFUNDED"] = "REFUNDED";
    DonationStatus["PARTIALLY_REFUNDED"] = "PARTIALLY_REFUNDED";
})(DonationStatus || (exports.DonationStatus = DonationStatus = {}));
var RecurringDonationStatus;
(function (RecurringDonationStatus) {
    RecurringDonationStatus["ACTIVE"] = "ACTIVE";
    RecurringDonationStatus["PAUSED"] = "PAUSED";
    RecurringDonationStatus["CANCELLED"] = "CANCELLED";
    RecurringDonationStatus["EXPIRED"] = "EXPIRED";
    RecurringDonationStatus["PAYMENT_FAILED"] = "PAYMENT_FAILED";
})(RecurringDonationStatus || (exports.RecurringDonationStatus = RecurringDonationStatus = {}));
var RecurringFrequency;
(function (RecurringFrequency) {
    RecurringFrequency["WEEKLY"] = "WEEKLY";
    RecurringFrequency["MONTHLY"] = "MONTHLY";
    RecurringFrequency["QUARTERLY"] = "QUARTERLY";
    RecurringFrequency["YEARLY"] = "YEARLY";
})(RecurringFrequency || (exports.RecurringFrequency = RecurringFrequency = {}));
var WithdrawalStatus;
(function (WithdrawalStatus) {
    WithdrawalStatus["REQUESTED"] = "REQUESTED";
    WithdrawalStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    WithdrawalStatus["APPROVED"] = "APPROVED";
    WithdrawalStatus["PROCESSING"] = "PROCESSING";
    WithdrawalStatus["COMPLETED"] = "COMPLETED";
    WithdrawalStatus["REJECTED"] = "REJECTED";
    WithdrawalStatus["FAILED"] = "FAILED";
    WithdrawalStatus["CANCELLED"] = "CANCELLED";
})(WithdrawalStatus || (exports.WithdrawalStatus = WithdrawalStatus = {}));
var OrganizationSubscriptionStatus;
(function (OrganizationSubscriptionStatus) {
    OrganizationSubscriptionStatus["ACTIVE"] = "ACTIVE";
    OrganizationSubscriptionStatus["PAST_DUE"] = "PAST_DUE";
    OrganizationSubscriptionStatus["CANCELLED"] = "CANCELLED";
    OrganizationSubscriptionStatus["EXPIRED"] = "EXPIRED";
    OrganizationSubscriptionStatus["TRIALING"] = "TRIALING";
})(OrganizationSubscriptionStatus || (exports.OrganizationSubscriptionStatus = OrganizationSubscriptionStatus = {}));
var VerificationDecision;
(function (VerificationDecision) {
    VerificationDecision["APPROVE"] = "APPROVE";
    VerificationDecision["REJECT"] = "REJECT";
    VerificationDecision["REQUEST_MORE_INFO"] = "REQUEST_MORE_INFO";
    VerificationDecision["SUSPEND"] = "SUSPEND";
    VerificationDecision["FLAG"] = "FLAG";
})(VerificationDecision || (exports.VerificationDecision = VerificationDecision = {}));
var DocumentType;
(function (DocumentType) {
    DocumentType["NATIONAL_ID"] = "NATIONAL_ID";
    DocumentType["PASSPORT"] = "PASSPORT";
    DocumentType["DRIVERS_LICENSE"] = "DRIVERS_LICENSE";
    DocumentType["MEDICAL_RECORD"] = "MEDICAL_RECORD";
    DocumentType["ORGANIZATION_REGISTRATION"] = "ORGANIZATION_REGISTRATION";
    DocumentType["ORGANIZATION_TAX_CERT"] = "ORGANIZATION_TAX_CERT";
    DocumentType["BENEFICIARY_CONSENT"] = "BENEFICIARY_CONSENT";
    DocumentType["BANK_STATEMENT"] = "BANK_STATEMENT";
    DocumentType["EVIDENCE_PHOTO"] = "EVIDENCE_PHOTO";
    DocumentType["OTHER_SUPPORTING"] = "OTHER_SUPPORTING";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
