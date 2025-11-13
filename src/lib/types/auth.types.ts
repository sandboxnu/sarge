import type { Session } from '@/generated/prisma';

export type AuthSession = Pick<Session, 'id' | 'userId'> & {
    headers: Headers;
    activeOrganizationId: string; // getSession returns a non-null activeOrganizationId
};
