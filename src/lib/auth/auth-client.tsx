'use client';

import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';
import { ac, owner, admin, recruiter, reviewer, member } from '@/lib/auth/permissions';

export const authClient = createAuthClient({
    plugins: [
        organizationClient({
            ac,
            roles: {
                owner,
                admin,
                recruiter,
                reviewer,
                member,
            },
        }),
    ],
});

export const { signIn, signUp, signOut, useSession, useActiveOrganization, useActiveMember } =
    authClient;
