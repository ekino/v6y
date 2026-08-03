'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { authProvider } from '../core/providers/authProvider.ts';

/**
 * Guards the admin SPA: since our `/login` page lives outside the react-router
 * tree (it's a plain Next.js route), we can't rely on ra-core's built-in
 * redirect-to-"/login" behaviour (it would try to navigate within the SPA's
 * own router, i.e. to "/admin/login", which doesn't exist). Instead we check
 * auth ourselves and do a full page redirect when unauthenticated.
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<'checking' | 'ok'>('checking');

    useEffect(() => {
        authProvider
            .checkAuth()
            .then(() => setStatus('ok'))
            .catch(() => {
                window.location.href = '/login';
            });
    }, []);

    if (status !== 'ok') {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-muted-foreground">Checking authentication...</p>
            </div>
        );
    }

    return <>{children}</>;
}
