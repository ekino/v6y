'use client';

import { useNavigationAdapter } from '@v6y/shared-ui';
import { useEffect } from 'react';

import { useLogin } from '../hooks/useAuth';

function ProtectedRoute({ children }) {
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
