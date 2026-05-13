import type { OrgInvitation } from '@/lib/types/invitation.types';

export type Member = {
    id: string;
    organizationId: string;
    userId: string;
    role: string;
    createdAt: Date;
};

export type MemberWithUser = Member & {
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
};

export type MemberTableRow =
    | { type: 'member'; data: MemberWithUser }
    | { type: 'invitation'; data: OrgInvitation };
