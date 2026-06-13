import type { MemberWithUser } from '@/lib/types/member.types';

export type OrgInvitationStatus = 'pending' | 'accepted' | 'rejected' | 'canceled';

// Full invitation data shape from our API / database (members table, invitation service).
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

// Shape returned by better-auth's getInvitation (accept-invitation screen).
export type AcceptInvitation = {
    id: string;
    email: string;
    organizationId: string;
    organizationName: string;
    role: string;
    status: OrgInvitationStatus;
    inviterId: string;
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
