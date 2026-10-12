import { SetMetadata } from '@nestjs/common';
import { UserRoleName } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (UserRoleName | 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | string)[]) => SetMetadata(ROLES_KEY, roles);
