'use client';

import { createAuthClient } from 'better-auth/react';
import { organizationClient, adminClient, emailOTPClient } from 'better-auth/client/plugins';
import {
    ac,
    owner,
    admin,
    recruiter,
    reviewer,
    member,
    adminAccessControl,
    superuser,
} from '@/lib/auth/permissions';

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
        adminClient({
            ac: adminAccessControl,
            roles: { superuser },
        }),
        emailOTPClient(),
    ],
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    useActiveOrganization,
    useActiveMember,
    requestPasswordReset,
    resetPassword,
    changePassword,
    changeEmail,
    sendVerificationEmail,
    verifyEmail,
    emailOtp,
} = authClient;
