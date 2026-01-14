import { type NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/crm'];

function hasAuthCookie(request: NextRequest): boolean {
    return (
        request.cookies.has('__Secure-better-auth.session') ||
        request.cookies.has('better-auth.session')
    );
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!hasAuthCookie(request)) {
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
