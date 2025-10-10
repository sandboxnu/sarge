import { type NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = ['/dashboard'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get('sarge.session')?.value;

    // Check if the route requires authentication
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    // Verify session if cookie exists
    let isAuthenticated = false;
    if (sessionCookie) {
        try {
            // Create secret key directly in middleware (Edge Runtime compatible)
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);

            await jwtVerify(sessionCookie, secret, {
                issuer: 'sargenu',
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
