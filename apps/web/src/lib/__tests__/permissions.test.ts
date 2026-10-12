import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hasCapability, maskEmail, maskPhone, maskAccountNumber } from '../permissions.server';

describe('Role Capability Matrix Enforcement', () => {
  it('Staff cannot access money, reports, approvals, or suspensions', () => {
    const staff = ['STAFF'];
    assert.equal(hasCapability(staff, 'VIEW_MONEY'), false);
    assert.equal(hasCapability(staff, 'VIEW_ANALYTICS'), false);
    assert.equal(hasCapability(staff, 'VIEW_DONATIONS'), false);
    assert.equal(hasCapability(staff, 'VIEW_REPORTS'), false);
    assert.equal(hasCapability(staff, 'APPROVE_REJECT_CAMPAIGN'), false);
    assert.equal(hasCapability(staff, 'PAUSE_CAMPAIGN'), false);
    assert.equal(hasCapability(staff, 'SUSPEND_USER'), false);
    assert.equal(hasCapability(staff, 'MANAGE_TEAM'), false);
    assert.equal(hasCapability(staff, 'VIEW_AUDIT_LOG'), false);
  });

  it('Staff can perform reviews, request changes, and send recommendations to admin', () => {
    const staff = ['STAFF'];
    assert.equal(hasCapability(staff, 'STAFF_REVIEW'), true);
    assert.equal(hasCapability(staff, 'REQUEST_CHANGES'), true);
    assert.equal(hasCapability(staff, 'SEND_TO_ADMIN'), true);
  });

  it('Admin can view money and approve/reject, but cannot manage team or view audit log', () => {
    const admin = ['ADMIN'];
    assert.equal(hasCapability(admin, 'VIEW_MONEY'), true);
    assert.equal(hasCapability(admin, 'APPROVE_REJECT_CAMPAIGN'), true);
    assert.equal(hasCapability(admin, 'PAUSE_CAMPAIGN'), true);
    assert.equal(hasCapability(admin, 'SUSPEND_USER'), true);
    assert.equal(hasCapability(admin, 'MANAGE_TEAM'), false);
    assert.equal(hasCapability(admin, 'VIEW_AUDIT_LOG'), false);
    assert.equal(hasCapability(admin, 'VIEW_UNMASKED_PHONE'), false);
  });

  it('Super Admin has all capabilities', () => {
    const superAdmin = ['SUPER_ADMIN'];
    assert.equal(hasCapability(superAdmin, 'VIEW_MONEY'), true);
    assert.equal(hasCapability(superAdmin, 'APPROVE_REJECT_CAMPAIGN'), true);
    assert.equal(hasCapability(superAdmin, 'MANAGE_TEAM'), true);
    assert.equal(hasCapability(superAdmin, 'VIEW_AUDIT_LOG'), true);
    assert.equal(hasCapability(superAdmin, 'VIEW_UNMASKED_PHONE'), true);
    assert.equal(hasCapability(superAdmin, 'TRANSFER_SUPER_ADMIN'), true);
    assert.equal(hasCapability(superAdmin, 'UPDATE_PLATFORM_FEE'), true);
  });
});

describe('Data Masking Utilities', () => {
  it('masks email correctly', () => {
    assert.equal(maskEmail('dawit.fundraiser@gmail.com'), 'd•••@gmail.com');
  });

  it('masks phone correctly', () => {
    assert.equal(maskPhone('+251911223344'), '+251 91 **** 344');
  });

  it('masks account number correctly with last4', () => {
    assert.equal(maskAccountNumber(null, '8842'), '•••• •••• •••• 8842');
  });
});

