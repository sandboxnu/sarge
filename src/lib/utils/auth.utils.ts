import { headers } from 'next/headers';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { UnauthorizedException } from '@/lib/utils/errors.utils';
import type { AuthSession, GetSessionOptions } from '@/lib/types/auth.types';
import type { OrgRole } from '@/lib/utils/roles.utils';

// Since organization names are unique, we can safely generate slugs without uniqueness checks.
export const generateSlugFromName = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

async function getSessionBase(options: GetSessionOptions): Promise<{
    id: string;
    userId: string;
    activeOrganizationId: string | null | undefined;
    role: OrgRole | null;
}> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.session) {
        throw new UnauthorizedException('Unauthorized to access this resource');
    }

    const response = session.session;

    if (options.requireActiveOrg && !response.activeOrganizationId) {
        throw new UnauthorizedException(
            'No active organization found. You should have an active organization to access this resource.'
        );
    }

    const role = (
        response.activeOrganizationId != null
            ? ((
                  await prisma.member.findUnique({
                      where: {
                          userId_organizationId: {
                              userId: response.userId,
                              organizationId: response.activeOrganizationId,
                          },
                      },
                      select: { role: true },
                  })
              )?.role ?? null)
            : null
    ) as OrgRole | null;

    if (options.requireActiveOrg && !role) {
        throw new UnauthorizedException(
            'No active organization membership found for this session.'
        );
    }

    return {
        id: response.id,
        userId: response.userId,
        activeOrganizationId: response.activeOrganizationId,
        role,
    };
}

// gets the session and requires an active organization
export const getSession = async (): Promise<AuthSession> => {
    return (await getSessionBase({ requireActiveOrg: true })) as AuthSession; // might have to revisit this later
};

// needed for when we're creating an org and the user doesn't have any orgs since the getSession method requires an active organization
export const getSessionWithoutOrg = async (): Promise<
    Omit<AuthSession, 'activeOrganizationId' | 'role'> & {
        activeOrganizationId?: string;
        role?: AuthSession['role'];
    }
> => {
    const result = await getSessionBase({ requireActiveOrg: false });
    return {
        ...result,
        activeOrganizationId: result.activeOrganizationId ?? undefined,
        role: result.role ?? undefined,
    };
};
