/**
 * Server-only permissions and role capability enforcement.
 */

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'USER';

export const CAPABILITIES = {
  // Financial & Reports
  VIEW_MONEY: ['SUPER_ADMIN', 'ADMIN'] as const,
  VIEW_ANALYTICS: ['SUPER_ADMIN', 'ADMIN'] as const,
  VIEW_DONATIONS: ['SUPER_ADMIN', 'ADMIN'] as const,
  VIEW_REPORTS: ['SUPER_ADMIN', 'ADMIN'] as const,
  VIEW_UNMASKED_PHONE: ['SUPER_ADMIN'] as const,

  // Campaign Approvals & Mutative Admin Powers
  APPROVE_REJECT_CAMPAIGN: ['SUPER_ADMIN', 'ADMIN'] as const,
  PAUSE_CAMPAIGN: ['SUPER_ADMIN', 'ADMIN'] as const,
  SUSPEND_USER: ['SUPER_ADMIN', 'ADMIN'] as const,

  // Staff Powers (Junior review)
  STAFF_REVIEW: ['STAFF', 'SUPER_ADMIN', 'ADMIN'] as const,
  REQUEST_CHANGES: ['STAFF', 'SUPER_ADMIN', 'ADMIN'] as const,
  SEND_TO_ADMIN: ['STAFF'] as const,

  // Super Admin Exclusive Powers
  MANAGE_TEAM: ['SUPER_ADMIN'] as const,
  VIEW_AUDIT_LOG: ['SUPER_ADMIN'] as const,
  TRANSFER_SUPER_ADMIN: ['SUPER_ADMIN'] as const,
  UPDATE_PLATFORM_FEE: ['SUPER_ADMIN'] as const,
};

export type Capability = keyof typeof CAPABILITIES;

export function hasCapability(userRoles: string[] = [], capability: Capability): boolean {
  const allowed = CAPABILITIES[capability] as readonly string[];
  return userRoles.some((role) => allowed.includes(role));
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '••••••@••••.com';
  const [local, domain] = email.split('@');
  const visible = local.slice(0, 1);
  return `${visible}•••@${domain}`;
}

export function maskPhone(phone?: string | null): string {
  if (!phone) return '+251 9• **** •••';
  const clean = phone.replace(/[^\d+]/g, '');
  // Format as +251 91 **** 333
  if (clean.startsWith('+251')) {
    const code = clean.slice(0, 4); // +251
    const prefix = clean.slice(4, 6); // 91
    const last3 = clean.slice(-3); // 333
    return `${code} ${prefix} **** ${last3}`;
  }
  if (clean.startsWith('09') || clean.startsWith('07')) {
    const prefix = clean.slice(0, 2);
    const last3 = clean.slice(-3);
    return `${prefix} **** ${last3}`;
  }
  return `${clean.slice(0, 6)} **** ${clean.slice(-3)}`;
}

export function maskAccountNumber(acc?: string | null, last4?: string | null): string {
  if (last4) return `•••• •••• •••• ${last4}`;
  if (!acc) return '•••• •••• •••• ••••';
  return `•••• •••• •••• ${acc.slice(-4)}`;
}
