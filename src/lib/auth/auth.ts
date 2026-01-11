import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { organization } from 'better-auth/plugins';
import { prisma } from '@/lib/prisma';
import { ac, owner, admin, recruiter, reviewer, member } from '@/lib/auth/permissions';

// used for vercel branch previews
const previewUrl =
    process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : null;

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    databaseHooks: {
        session: {
            create: {
                before: async (session) => {
                    // set activeOrganizationId to user's first organization
                    const member = await prisma.member.findFirst({
                        where: { userId: session.userId },
                        orderBy: { createdAt: 'asc' },
                    });

                    if (member) {
                        return {
                            data: {
                                ...session,
                                activeOrganizationId: member.organizationId,
                            },
                        };
                    }

                    return { data: session };
                },
            },
        },
    },
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
    trustedOrigins: ['http://localhost:3000', process.env.BETTER_AUTH_URL, previewUrl].filter(
        (origin): origin is string => Boolean(origin)
    ),
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
        }),
    ],
});
