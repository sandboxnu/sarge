import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { organization } from 'better-auth/plugins';
import { prisma } from '@/lib/prisma';
import { ac, owner, admin, recruiter, reviewer, member } from '@/lib/auth/permissions';
import sesConnector from '@/lib/connectors/ses.connector';
import { generateEmailVerificationHTML } from '@/lib/templates/emailVerification';

const baseUrl =
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const requireSignupEmailVerification = process.env.REQUIRE_EMAIL_VERIFICATION === 'true';

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ newEmail, url }) => {
                try {
                    const emailSent = await sesConnector.sendEmail(
                        newEmail,
                        'Verify your new email for Sarge',
                        `Hello,\n\nClick the link below to confirm ${newEmail} as your new Sarge email:\n\n${url}\n\nThis link expires in 1 hour. If you didn't request this, you can ignore this email.`,
                        {
                            html: generateEmailVerificationHTML({
                                verifyUrl: url,
                                email: newEmail,
                            }),
                        }
                    );
                    if (!emailSent) {
                        console.error('SES reported failure to send change-email verification');
                    }
                } catch (error) {
                    console.error('Failed to send change-email verification:', error);
                }
            },
        },
    },
    emailVerification: {
        sendOnSignUp: requireSignupEmailVerification,
        autoSignInAfterVerification: true,
        expiresIn: 60 * 60,
        sendVerificationEmail: async ({ user, url }) => {
            try {
                const emailSent = await sesConnector.sendEmail(
                    user.email,
                    'Verify your email for Sarge',
                    `Hello,\n\nClick the link below to verify your email address (${user.email}) on Sarge:\n\n${url}\n\nThis link expires in 1 hour.`,
                    {
                        html: generateEmailVerificationHTML({
                            verifyUrl: url,
                            email: user.email,
                        }),
                    }
                );
                if (!emailSent) {
                    console.error('SES reported failure to send verification email');
                }
            } catch (error) {
                console.error('Failed to send verification email:', error);
            }
        },
    },
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
        requireEmailVerification: requireSignupEmailVerification,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,

        sendResetPassword: async ({ user, url }) => {
            try {
                const emailSent = await sesConnector.sendEmail(
                    user.email,
                    'Reset your Sarge password',
                    `Hello,\n\nWe received a request to reset your Sarge password. Click the link below to set a new password:\n\n${url}\n\nThis link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.`
                );
                if (!emailSent) {
                    console.error('SES reported failure to send reset password email');
                }
            } catch (error) {
                console.error('Failed to send reset password email:', error);
            }
        },
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
                    }
                } catch (error) {
                    console.error('Failed to send invitation email:', error);
                }
            },
        }),
    ],
});
