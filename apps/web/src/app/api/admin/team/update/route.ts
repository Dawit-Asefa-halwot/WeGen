import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, role, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Member ID is required' }, { status: 400 });
    }

    if (status) {
      await prisma.user.update({
        where: { id },
        data: { isActive: status === 'Active' },
      });
    }

    if (role) {
      const targetRole = await prisma.role.findUnique({ where: { name: role } });
      if (targetRole) {
        const existingRoles = await prisma.userRole.findMany({
          where: { userId: id },
          include: { role: true },
        });
        const roleIdsToDelete = existingRoles
          .filter((r) => r.role.name === 'ADMIN' || r.role.name === 'STAFF')
          .map((r) => r.id);

        if (roleIdsToDelete.length > 0) {
          await prisma.userRole.deleteMany({
            where: { id: { in: roleIdsToDelete } },
          });
        }

        await prisma.userRole.create({
          data: {
            userId: id,
            roleId: targetRole.id,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error updating team member:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
