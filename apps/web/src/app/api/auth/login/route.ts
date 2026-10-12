import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'wegen_salt').digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    const emailLower = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
      include: {
        roles: { include: { role: true } },
        orgMemberships: { include: { organization: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    const expectedHash = hashPassword(password);
    const isShaMatch = expectedHash === user.passwordHash;

    let isMatch = isShaMatch;
    if (!isMatch) {
      try {
        const bcrypt = await import('bcryptjs');
        isMatch = await bcrypt.compare(password, user.passwordHash);
      } catch {}
    }

    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ success: false, message: 'This account has been suspended' }, { status: 403 });
    }

    const roles = user.roles.map((r) => r.role.name);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          roles,
          organization: user.orgMemberships?.[0]?.organization
            ? {
                id: user.orgMemberships[0].organization.id,
                name: user.orgMemberships[0].organization.name,
                slug: user.orgMemberships[0].organization.slug,
              }
            : undefined,
        },
        tokens: {
          accessToken: `token-db-${user.id}-${Date.now()}`,
          refreshToken: `refresh-db-${user.id}-${Date.now()}`,
        },
      },
    });
  } catch (err: any) {
    console.error('Error during database login:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
