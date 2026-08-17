import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import VitalityNavigationPaths from './commons/config/VitalityNavigationPaths';

// /health must stay reachable without a session: it is what the container
// healthcheck and the orchestrator liveness probe call.
const PUBLIC_ROUTES = ['/login', '/faq', '/contact', '/health', '/v6y/graphql', '/v6y/graphql/'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (isPublicRoute) {
        return NextResponse.next();
    }

    const authCookie = request.cookies.get('auth');

    if (!authCookie?.value) {
        return NextResponse.redirect(new URL(VitalityNavigationPaths.LOGIN, request.url));
    }

    if (pathname === '/') {
        return NextResponse.redirect(new URL(VitalityNavigationPaths.DASHBOARD, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$|api).*)',
    ],
};
