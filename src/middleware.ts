import { type NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = ['/dashboard'];

async function hashUAEdge(ua: string | null | undefined) {
    const encoder = new TextEncoder();
    const data = encoder.encode((ua ?? '').trim());
    const buffer = await crypto.subtle.digest('SHA-256', data);
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get('sarge.session')?.value;

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    let isAuthenticated = false;
    if (sessionCookie) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);

            const { payload, protectedHeader } = await jwtVerify(sessionCookie, secret, {
                issuer: 'sargenu',
                algorithms: ['HS256'],
                clockTolerance: 60,
            });

            if (protectedHeader.alg !== 'HS256') throw new Error('Bad algorithm');

            // check UA binding
            const uaFromRequest = request.headers.get('user-agent');
            const uaHashNow = await hashUAEdge(uaFromRequest);
            const uaClaim = payload.ua;
            if (typeof uaClaim !== 'string' || uaClaim !== uaHashNow) {
                throw new Error('User-Agent mismatch');
            }

            isAuthenticated = true;
        } catch {
            isAuthenticated = false;
        }
    }

    if (isProtectedRoute && !isAuthenticated) {
        const res = NextResponse.redirect(new URL('/login', request.url));
        res.cookies.delete('sarge.session');
        return res;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
