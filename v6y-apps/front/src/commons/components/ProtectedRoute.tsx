'use client';

import { useEffect } from 'react';

import { useLogin } from '../hooks/useAuth';
import { useNavigationAdapter } from '@v6y/ui-kit-front';

import { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isLoggedIn, isLoginLoading } = useLogin();
    const { pathname, router } = useNavigationAdapter();

    useEffect(() => {
        if (!isLoggedIn && !isLoginLoading) {
            router.replace('/login');
        }
    }, [isLoggedIn, isLoginLoading, router]);

    if (pathname === '/login') {
        return children;
    }

    return isLoggedIn ? children : null;
}

export default ProtectedRoute;
