import { prisma } from '@/lib/prisma';
import type { OrgInvitation } from '@/lib/types/invitation.types';
import { NotFoundException } from '@/lib/utils/errors.utils';

/**
 * Pending invitations for the org members table better auth omits createdAt and expiresAt
 * (so thats why we're not using the better auth list api)
 */
async function listPendingInvitationsForOrganization(
    organizationId: string
): Promise<OrgInvitation[]> {
    const invitations = await prisma.invitation.findMany({
        where: {
            organizationId,
            status: 'pending',
        },
        orderBy: { createdAt: 'desc' },
    });

    return invitations.map((i) => ({
        id: i.id,
        email: i.email,
        organizationId: i.organizationId,
        role: i.role,
        status: i.status,
        inviterId: i.inviterId,
        createdAt: i.createdAt,
        expiresAt: i.expiresAt,
    }));
}

async function updatePendingInvitationRole(
    organizationId: string,
    invitationId: string,
    role: string
): Promise<OrgInvitation> {
    const existing = await prisma.invitation.findFirst({
        where: {
            id: invitationId,
            organizationId,
            status: 'pending',
        },
    });

    if (!existing) {
        throw new NotFoundException('Invitation', invitationId);
    }

    const updatedInvitation = await prisma.invitation.update({
        where: { id: invitationId },
        data: { role },
    });

    return {
        id: updatedInvitation.id,
        email: updatedInvitation.email,
        organizationId: updatedInvitation.organizationId,
        role: updatedInvitation.role,
        status: updatedInvitation.status,
        inviterId: updatedInvitation.inviterId,
        createdAt: updatedInvitation.createdAt,
        expiresAt: updatedInvitation.expiresAt,
    };
}

async function deletePendingInvitation(
    organizationId: string,
    invitationId: string
): Promise<void> {
    const existing = await prisma.invitation.findFirst({
        where: {
            id: invitationId,
            organizationId,
            status: 'pending',
        },
    });

    if (!existing) {
        throw new NotFoundException('Invitation', invitationId);
    }

    await prisma.invitation.delete({
        where: { id: invitationId },
    });
}

const InvitationService = {
    listPendingInvitationsForOrganization,
    updatePendingInvitationRole,
    deletePendingInvitation,
};

export default InvitationService;
