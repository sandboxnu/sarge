import { headers } from 'next/headers';
import { auth } from '@/lib/auth/auth';
import { UnauthorizedException } from '@/lib/utils/errors.utils';
import type { AuthSession } from '@/lib/types/auth.types';

// Since organization names are unique, we can safely generate slugs without uniqueness checks.
export const generateSlugFromName = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const getSession = async (): Promise<AuthSession> => {
    const session = await auth.api.getSession({ headers: await headers(), returnHeaders: true });

    if (!session?.response?.session) {
        throw new UnauthorizedException('Unauthorized to access this resource');
    }
    const response = session.response.session;

    if (!response.activeOrganizationId) {
        throw new UnauthorizedException(
            'No active organization found. Please select an organization to continue.'
        );
    }

    return {
        headers: session.headers,
        id: response.id,
        userId: response.userId,
        activeOrganizationId: response.activeOrganizationId,
    };
};
