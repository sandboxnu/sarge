import { randomInt } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import sesConnector from '@/lib/connectors/ses.connector';
import type { OrgInvitation } from '@/lib/types/invitation.types';
import { HttpException, NotFoundException } from '@/lib/utils/errors.utils';

export const baseUrl =
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const INVITATION_TTL_SECONDS = 60 * 60 * 24;

// no 0/O/1/I so codes read back unambiguously
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// ponytail: no collision retry (~10^12 codes); on a clash, Resend issues a fresh code
function generateCode(): string {
    return Array.from({ length: 8 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('');
}

async function sendInvitationEmail(invitationId: string): Promise<void> {
    // only set when missing, so a code already emailed never changes
    await prisma.invitation.updateMany({
        where: { id: invitationId, code: null },
        data: { code: generateCode() },
    });

    const invitation = await prisma.invitation.update({
        where: { id: invitationId },
        data: { expiresAt: new Date(Date.now() + INVITATION_TTL_SECONDS * 1000) },
        include: { organization: { select: { name: true } } },
    });

    const orgName = invitation.organization.name;
    const inviteLink = `${baseUrl}/accept-invitation?id=${invitation.id}`;
    const newLink = `${baseUrl}/accept-invitation/new-link?id=${invitation.id}`;
    const body = `Hello!\n\nYou've been invited to join the organization "${orgName}" on Sarge.\n\nPlease click the following link to accept the invitation:\n\n${inviteLink}\n\nOr sign in and enter this code: ${invitation.code}\n\nThis link and code expire in 24 hours.\n\nNeed a new link? ${newLink}`;

    const emailSent = await sesConnector
        .sendEmail(invitation.email, `You're invited to join ${orgName} on Sarge!`, body)
        .catch((error: unknown) => {
            console.error('Failed to send invitation email:', error);
            return false;
        });

    if (!emailSent) {
        console.error('Invitation email was not sent');
        if (process.env.NODE_ENV === 'development')
            console.warn(`[dev] invitation email:\n${body}`);
    }
}

// better-auth reports expired invites as "not found"
async function isInvitationExpired(invitationId: string): Promise<boolean> {
    const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
        select: { status: true, expiresAt: true },
    });
    return invitation?.status === 'pending' && invitation.expiresAt < new Date();
}

async function resolveCodeForUser(
    code: string,
    email: string
): Promise<{ invitationId: string; organizationId: string }> {
    const invitation = await prisma.invitation.findUnique({
        where: { code: code.trim().toUpperCase() },
    });

    if (
        !invitation ||
        invitation.status !== 'pending' ||
        invitation.expiresAt < new Date() ||
        invitation.email.toLowerCase() !== email.toLowerCase()
    ) {
        throw new HttpException(404, 'That code is invalid or has expired.');
    }

    return { invitationId: invitation.id, organizationId: invitation.organizationId };
}

async function resendPendingInvitation(invitationId: string): Promise<void> {
    const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
        select: { status: true },
    });
    if (invitation?.status !== 'pending') return;
    await sendInvitationEmail(invitationId);
}

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
    sendInvitationEmail,
    resolveCodeForUser,
    resendPendingInvitation,
    isInvitationExpired,
};

export default InvitationService;
