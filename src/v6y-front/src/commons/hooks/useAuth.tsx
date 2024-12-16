import Cookies from 'js-cookie';

const useLogin = () => {
    const cookieStore = Cookies;
    const auth = cookieStore.get('auth');

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

export { useLogin };
