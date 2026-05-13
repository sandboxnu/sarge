import type { MemberWithUser } from '@/lib/types/member.types';

export type OrgInvitationStatus = 'pending' | 'accepted' | 'rejected' | 'canceled';

export type OrgInvitation = {
    id: string;
    email: string;
    organizationId: string;
    role: string;
    status: OrgInvitationStatus;
    inviterId: string;
    createdAt: Date;
    expiresAt: Date;
};

export type MemberRowStatus = 'active' | 'invite-sent' | 'invite-expired';

export type OrgMembersAndInvitations = {
    members: MemberWithUser[];
    invitations: OrgInvitation[];
};

export type MemberTableRow =
    | { type: 'member'; data: MemberWithUser }
    | { type: 'invitation'; data: OrgInvitation };
