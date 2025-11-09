import type { User, RoleType } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { type Result, notFound, success, forbidden } from '@/lib/responses';
import { isUserAdmin } from '@/lib/utils/permissions.utils';

async function getUserRole(userId: string): Promise<Result<User>> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { userRole: true },
    });

    if (!user) {
        return notFound('User', userId);
    }

    return success(user, 200);
}

async function assignRole(
    assignedUserId: string,
    assigningUserId: string,
    role: RoleType
): Promise<Result<User>> {
    const target = await prisma.user.findUnique({ where: { id: assignedUserId } });

    if (!target) {
        return notFound('User', assignedUserId);
    }

    if (!target.orgId) {
        return forbidden('Target user has no organization');
    }

    const isAdmin = await isUserAdmin(assigningUserId, target.orgId);
    if (!isAdmin) {
        return forbidden('Assigning user is not an admin in the target organization');
    }

    const dbRole = await prisma.role.findFirst({ where: { role } });
    if (!dbRole) {
        return forbidden('Role is not available');
    }
    const updated = await prisma.user.update({
        where: { id: assignedUserId },
        data: { roleId: dbRole.id },
        include: { userRole: true },
    });

    return success(updated, 200);
}

const RoleService = {
    getUserRole,
    assignRole,
};

export default RoleService;
