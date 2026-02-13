import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { organization } from 'better-auth/plugins';
import { prisma } from '@/lib/prisma';
import { ac, owner, admin, recruiter, reviewer, member } from '@/lib/auth/permissions';
import sesConnector from '@/lib/connectors/ses.connector';

const baseUrl =
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

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
    trustedOrigins: [baseUrl],
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

            async sendInvitationEmail(data) {
                const inviteLink = `${baseUrl}/accept-invitation?id=${data.invitation.id}`;
                try {
                    const emailSent = await sesConnector.sendEmail(
                        data.invitation.email,
                        `You're invited to join ${data.organization.name} on Sarge!`,
                        `Hello!\n\nYou've been invited to join the organization "${data.organization.name}" on Sarge.\n\nPlease click the following link to accept the invitation:\n\n${inviteLink}`
                    );
                    if (!emailSent) {
                        console.error('SES reported failure to send invitation email');
                    } else {
                        console.log(`Invitation email sent to ${data.invitation.email}`);
                    }
                } catch (error) {
                    console.error('Failed to send invitation email:', error);
                }
            },
        }),
    ],
});
