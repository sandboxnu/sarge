import { type NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { createSecretKey } from 'node:crypto';
import { config as authConfig } from './lib/auth/auth';

const secretKey = createSecretKey(process.env.JWT_SECRET!, 'utf-8');

// Define protected routes
const protectedRoutes = ['/api'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get(authConfig.cookieName)?.value;

    // Check if the route requires authentication
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    // Verify session if cookie exists
    let isAuthenticated = false;
    if (sessionCookie) {
        try {
            await jwtVerify(sessionCookie, secretKey, {
                issuer: authConfig.issuer,
            });
            isAuthenticated = true;
        } catch {
            isAuthenticated = false;
        }
    }

    // Redirect logic
    if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
