import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { organization } from 'better-auth/plugins';
import { prisma } from '@/lib/prisma';
import { ac, owner, admin, recruiter, reviewer, member } from '@/lib/auth/permissions';
import { generateSlugFromName } from '@/lib/utils/auth.utils';

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,

        // sendResetPassword: async ({ user, url, token }) => {
        //     // TODO: Implement email sending when email service is configured
        // },
        resetPasswordTokenExpiresIn: 60 * 60,
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60, // 1 hour - cache session data in cookie
        },
    },
    trustedOrigins: [process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'],
    plugins: [
        organization({
            ac,
            roles: {
                owner,
                admin,
                recruiter,
                reviewer,
                member,
            },

            allowUserToCreateOrganization: true,
            creatorRole: 'owner',
            organizationLimit: 10,
            membershipLimit: 100,
            invitationExpiresIn: 60 * 60 * 48,
            invitationLimit: 100,
            cancelPendingInvitationsOnReInvite: false,

            organizationHooks: {
                beforeCreateOrganization: async ({ organization }) => {
                    if (!organization.slug && organization.name) {
                        return {
                            data: {
                                ...organization,
                                slug: generateSlugFromName(organization.name),
                            },
                        };
                    }
                    return { data: organization };
                },
            },
        }),
    ],
});
