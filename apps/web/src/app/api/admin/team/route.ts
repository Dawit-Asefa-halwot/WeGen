import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'wegen_salt').digest('hex');
}

export async function GET() {
  try {
    const adminStaffUsers = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: {
              name: {
                in: ['SUPER_ADMIN', 'ADMIN', 'STAFF'],
              },
            },
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const mapped = adminStaffUsers.map((u) => {
      const roleNames = u.roles.map((r) => r.role.name);
      let primaryRole = 'STAFF';
      if (roleNames.includes('SUPER_ADMIN')) primaryRole = 'SUPER_ADMIN';
      else if (roleNames.includes('ADMIN')) primaryRole = 'ADMIN';

      return {
        id: u.id,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
        email: u.email,
        role: primaryRole,
        status: u.isActive ? 'Active' : 'Suspended',
        lastActive: 'Active',
      };
    });

    return NextResponse.json({ success: true, data: mapped });
  } catch (err: any) {
    console.error('Error fetching admin team:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, role } = body;

    if (!email || !name || !role) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and role are required.' },
        { status: 400 }
      );
    }

    const emailLower = String(email).trim().toLowerCase();
    const parts = String(name).trim().split(' ');
    const firstName = parts[0] || 'Team';
    const lastName = parts.slice(1).join(' ') || 'Member';
    const pwd = password || 'Password123!';
    const passwordHash = hashPassword(pwd);

    // Fetch roles
    const targetRole = await prisma.role.findUnique({
      where: { name: role },
    });
    const userRole = await prisma.role.findUnique({
      where: { name: 'USER' },
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: emailLower },
      include: { roles: { include: { role: true } } },
    });

    if (existingUser) {
      // Update role & activate if exists
      if (targetRole) {
        const hasRole = existingUser.roles.some((r) => r.role.name === role);
        if (!hasRole) {
          await prisma.userRole.create({
            data: {
              userId: existingUser.id,
              roleId: targetRole.id,
            },
          });
        }
      }

      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          passwordHash,
          isActive: true,
          isEmailVerified: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: existingUser.id,
          name: `${existingUser.firstName} ${existingUser.lastName}`.trim(),
          email: existingUser.email,
          role,
          status: 'Active',
          lastActive: 'Just now',
        },
      });
    }

    // Create new user in PostgreSQL
    const roleCreates = [];
    if (targetRole) roleCreates.push({ roleId: targetRole.id });
    if (userRole) roleCreates.push({ roleId: userRole.id });

    const newUser = await prisma.user.create({
      data: {
        email: emailLower,
        passwordHash,
        firstName,
        lastName,
        phoneNumber: phone || '+251911000000',
        isEmailVerified: true,
        isActive: true,
        roles: {
          create: roleCreates,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        name: `${newUser.firstName} ${newUser.lastName}`.trim(),
        email: newUser.email,
        role,
        status: 'Active',
        lastActive: 'Just now',
      },
    });
  } catch (err: any) {
    console.error('Error creating admin team member in DB:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
