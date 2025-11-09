import { RoleType } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

export const isUserAdmin = async (userId: string, organizationId: string): Promise<boolean> => {
    const admin = await prisma.user.findFirst({
        where: {
            id: userId,
            orgId: organizationId,
            userRole: {
                role: RoleType.ADMIN,
            },
        },
    });

    return !!admin;
};
