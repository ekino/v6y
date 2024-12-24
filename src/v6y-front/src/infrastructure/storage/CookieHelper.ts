import Cookies from 'js-cookie';


export interface AuthCookie {
    token: string;
    _id: string;
    role: string;
}

export const getAuthCookie = (): AuthCookie | null => {
    const auth = Cookies.get('auth');
    if (!auth) return null;
    try {
        return JSON.parse(auth) as AuthCookie;
    } catch (e) {
        console.error('Failed to parse auth cookie:', e);
        return null;
    }
};

export const setAuthCookie = (token: string, _id: string, role: string) => {
    Cookies.set('auth', JSON.stringify({ token, _id, role }), {
        expires: 30, // 30 days
        path: '/',
    });
};

export const removeAuthCookie = () => {
    Cookies.remove('auth');
};
