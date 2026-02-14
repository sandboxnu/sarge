import type { Member } from '@/lib/types/member.types';
import { prisma } from '@/lib/prisma';
import { NotFoundException } from '@/lib/utils/errors.utils';
import { auth } from '@/lib/auth/auth';
import { assertPermission } from '@/lib/utils/permissions.utils';

async function updateMemberRole(
    memberIdToUpdate: string,
    role: string,
    organizationId: string,
    headers: Headers
): Promise<Member> {
    await assertPermission(
        headers,
        { member: ['update'] },
        'You are not an admin of this organization'
    );

    const existingMember = await prisma.member.findUnique({
        where: {
            id: memberIdToUpdate,
            organizationId,
        },
    });

    if (!existingMember) {
        throw new NotFoundException('Member', memberIdToUpdate);
    }

    const updatedMember = await auth.api.updateMemberRole({
        body: {
            role,
            memberId: memberIdToUpdate,
            organizationId,
        },
    });

    // Can use transformers to convert the response to the Member type if needed
    return {
        id: updatedMember.id,
        organizationId: updatedMember.organizationId,
        userId: updatedMember.userId,
        role: updatedMember.role,
        createdAt: updatedMember.createdAt,
    };
}

const MemberService = {
    updateMemberRole,
};

export default MemberService;
