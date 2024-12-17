import { getAuthCookie, removeAuthCookie } from '../../infrastructure/storage/CookieHelper';

const getAuthToken = () => {
    const auth = getAuthCookie();

    return auth?.token;
}

const useLogin = () => {
    const auth = getAuthCookie();

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
