import type { AuthCookie } from '../../infrastructure/storage/CookieHelper';
import { getAuthCookie, removeAuthCookie } from '../../infrastructure/storage/CookieHelper';

const getAuthToken = (): string | undefined => {
    const auth: AuthCookie | null = getAuthCookie();

    return auth?.token;
};


const useLogin = () => {
    const auth: AuthCookie | null = getAuthCookie();
    
    if (auth) {
        return {
            isLoggedIn: true,
            isLoginLoading: false,
        };
    }

    return {
        isLoggedIn: false,
        isLoginLoading: false,
    };
};

const useLogout = () => {
    const onLogout = () => {
        removeAuthCookie();
    };

    return { onLogout };
};

export { useLogin, useLogout, getAuthToken };
