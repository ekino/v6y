import Cookies from 'js-cookie';

export const useRole = () => {

    const getRole = () => {
        const auth = Cookies.get('auth');
        return JSON.parse(auth || '{}')?.role;
    }

    return ({
        getRole
    });
};