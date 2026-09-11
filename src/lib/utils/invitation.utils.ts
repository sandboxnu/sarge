import type { MemberRowStatus, OrgInvitation } from '@/lib/types/invitation.types';

/**
 * How we label an invite on the members table: still open ("sent") or expired.
 * Better Auth can leave `status` as `pending` after `expiresAt`, so we also
 * compare `expiresAt` to the current time.
 */
export function getInvitationStatus(
    invitation: Pick<OrgInvitation, 'status' | 'expiresAt'>
): MemberRowStatus {
    if (invitation.status === 'pending') {
        return invitation.expiresAt.getTime() <= Date.now() ? 'invite-expired' : 'invite-sent';
    }
    // Accepted, rejected, or canceled we show a base chip just in case yk
    return 'invite-expired';
}

export function getMemberRowStatusLabel(status: MemberRowStatus): string {
    switch (status) {
        case 'active':
            return 'Active';
        case 'invite-sent':
            return 'Invite Sent';
        case 'invite-expired':
            return 'Invite Expired';
    }
}

export function getMemberRowStatusVariant(
    status: MemberRowStatus
): 'success' | 'neutral' | 'error' {
    switch (status) {
        case 'active':
            return 'success';
        case 'invite-sent':
            return 'neutral';
        case 'invite-expired':
            return 'error';
    }
}
