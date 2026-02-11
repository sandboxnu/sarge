import type { Session } from '@/generated/prisma';
import type { OrgRole } from '@/lib/utils/role.utils';

export type AuthSession = Pick<Session, 'id' | 'userId'> & {
    activeOrganizationId: string;
    role: OrgRole;
};

export type GetSessionOptions = {
    requireActiveOrg?: boolean;
};
