import type { Member, MemberWithUser } from '@/lib/types/member.types';
import { prisma } from '@/lib/prisma';
import { ConflictException, NotFoundException } from '@/lib/utils/errors.utils';
import { auth } from '@/lib/auth/auth';
import { assertOrgPermission } from '@/lib/utils/permissions.utils';

async function updateMemberRole(
    memberIdToUpdate: string,
    role: string,
    organizationId: string,
    headers: Headers
): Promise<Member> {
    await assertOrgPermission(
        headers,
        { member: ['update'] },
        'You are not an admin of this organization'
    );

    if (role === 'owner') {
        throw new ConflictException(
            'Member',
            'cannot be promoted to owner via this endpoint — use transfer ownership'
        );
    }

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

async function listMembersWithUsers(organizationId: string): Promise<MemberWithUser[]> {
    const members = await prisma.member.findMany({
        where: { organizationId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return members.map((m) => ({
        id: m.id,
        organizationId: m.organizationId,
        userId: m.userId,
        role: m.role,
        createdAt: m.createdAt,
        user: {
            id: m.user.id,
            name: m.user.name,
            email: m.user.email,
            image: m.user.image,
        },
    }));
}

const MemberService = {
    updateMemberRole,
    listMembersWithUsers,
};

export default MemberService;
