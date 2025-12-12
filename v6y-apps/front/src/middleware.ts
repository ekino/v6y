import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/faq', '/contact'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (isPublicRoute) {
        return NextResponse.next();
    }

    const authCookie = request.cookies.get('auth');

    if (!authCookie?.value) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$|api).*)',
    ],
};
