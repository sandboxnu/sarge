import { type NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = ['/dashboard'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get('sarge.session')?.value;

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    let isAuthenticated = false;
    if (sessionCookie) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);

            await jwtVerify(sessionCookie, secret, {
                issuer: 'sargenu',
            });

            isAuthenticated = true;
        } catch {
            isAuthenticated = false;
        }
    }

    if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
