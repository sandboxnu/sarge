import type { Session } from '@/generated/prisma';

export type AuthSession = Pick<Session, 'id' | 'userId'> & {
    activeOrganizationId: string;
};

export type GetSessionOptions = {
    requireActiveOrg?: boolean;
};
