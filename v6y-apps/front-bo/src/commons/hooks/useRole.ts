import Cookie from 'js-cookie';

/**
 * Read user role
 */
export const useRole = () => {
    const getRole = () => {
        const auth = Cookie.get('auth');
        return JSON.parse(auth || '{}')?.role;
    };
    return {
        getRole,
    };
};
