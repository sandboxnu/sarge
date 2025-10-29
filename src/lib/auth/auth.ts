import 'server-only';

import { createSecretKey, createHash } from 'node:crypto';
import { jwtVerify, SignJWT } from 'jose';
import { cookies, headers } from 'next/headers';

export const config = {
    cookieName: 'sarge.session',
    expiration: 24 * 60 * 60,
    issuer: 'sargenu',
    secure: process.env.NODE_ENV === 'production',
};

function getSecretKey() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is required');
    }
    return createSecretKey(jwtSecret, 'utf-8');
}

function hashUA(ua: string | null | undefined) {
    const normalized = (ua ?? '').trim();
    return createHash('sha256').update(normalized).digest('hex');
}

export interface SessionPayload {
    userId: string;
    email: string;
}

type JwtClaims = SessionPayload & {
    ua: string;
};

export async function createSession(payload: SessionPayload) {
    const hders = await headers();
    const uaHeader = hders.get('user-agent');
    const uaHash = hashUA(uaHeader);

    const session = await new SignJWT({ ...payload, ua: uaHash })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setIssuer(config.issuer)
        .setExpirationTime(Math.floor(Date.now() / 1000) + config.expiration)
        .sign(getSecretKey());

    const cookieStore = await cookies();
    cookieStore.set(config.cookieName, session, {
        httpOnly: true,
        secure: config.secure,
        maxAge: config.expiration,
        path: '/',
        sameSite: 'strict',
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
        const { payload, protectedHeader } = await jwtVerify(session, getSecretKey(), {
            issuer: config.issuer,
            algorithms: ['HS256'],
            clockTolerance: 60,
        });

        if (protectedHeader.alg !== 'HS256') return null;

        const hders = await headers();
        const uaHeader = hders.get('user-agent');
        const uaHash = hashUA(uaHeader);

        const claims = payload as unknown as JwtClaims;
        if (typeof claims.ua !== 'string') return null;
        if (claims.ua !== uaHash) return null;

        return { userId: claims.userId, email: claims.email };
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
