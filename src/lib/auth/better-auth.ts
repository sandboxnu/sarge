import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // disabled for now
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,

        // sendResetPassword: async ({ user, url, token }) => {
        //     // TODO: Implement email sending when email service is configured
        // },
        resetPasswordTokenExpiresIn: 3600, // 1 hour
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days - total session lifetime
        updateAge: 60 * 60, // 1 hour - session expiry refreshes every hour on activity - how often session refreshes when user is active
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60, // 1 hour - cache session data in cookie
        },
    },
    trustedOrigins: [process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'],
});
