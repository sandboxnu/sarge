import 'server-only';

import { createSecretKey } from 'node:crypto';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

export const config = {
    cookieName: 'sarge.session',
    expiration: 60 * 60 * 24 * 7,
    issuer: 'sargenu',
    secure: process.env.NODE_ENV === 'production',
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const secretKey = createSecretKey(process.env.JWT_SECRET!, 'utf-8');

export interface SessionPayload {
    userId: string;
    email: string;
}

export async function createSession(payload: SessionPayload) {
    const session = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer(config.issuer)
        .setExpirationTime(Math.floor(Date.now() / 1000) + config.expiration)
        .sign(secretKey);

    const cookieStore = await cookies();
    cookieStore.set(config.cookieName, session, {
        httpOnly: true,
        secure: config.secure,
        maxAge: config.expiration,
        path: '/',
        sameSite: 'lax',
    });

    return session;
}

export async function verifySession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get(config.cookieName)?.value;

    if (!session) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(session, secretKey, {
            issuer: config.issuer,
        });

        return payload as unknown as SessionPayload;
    } catch {
        return null;
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete(config.cookieName);
}

export async function requireAuth(): Promise<SessionPayload> {
    const session = await verifySession();

    if (!session) {
        throw new Error('Authentication required');
    }

    return session;
}
