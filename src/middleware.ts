import { type NextRequest, NextResponse } from 'next/server';
import { getCookieCache } from 'better-auth/cookies';

const protectedRoutes = ['/dashboard'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtectedRoute) {
        // Get session from cookie cache (optimistic check for middleware performance)
        // Note: Full session validation happens on the server/page level
        const session = await getCookieCache(request);

        if (!session) {
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
