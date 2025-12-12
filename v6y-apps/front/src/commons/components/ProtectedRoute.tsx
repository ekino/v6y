'use client';

import { useEffect } from 'react';
import { PropsWithChildren } from 'react';

import { useNavigationAdapter } from '@v6y/ui-kit';

import { useLogin } from '../hooks/useAuth';

function ProtectedRoute({ children }: PropsWithChildren) {
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
