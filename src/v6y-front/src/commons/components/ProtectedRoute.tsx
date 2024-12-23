'use client';

import { useEffect } from 'react';

import useNavigationAdapter from '../../infrastructure/adapters/navigation/useNavigationAdapter';
import { useLogin } from '../hooks/useAuth';

function ProtectedRoute({ children }: React.PropsWithChildren<React.ReactNode>) {
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
