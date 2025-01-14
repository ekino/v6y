import Cookie from 'js-cookie';

export interface SessionType {
    token: string;
    _id: string;
    role: string;
}

/**
 * Get user session
 */
export const getSession = (): SessionType | null => {
    const auth = Cookie.get('auth');
    if (!auth) return null;
    try {
        return JSON.parse(auth) as SessionType;
    } catch (e) {
        console.error('Failed to parse auth session:', e);
        return null;
    }
};

/**
 * Set the auth session
 * @param token
 * @param _id
 * @param role
 */
export const setSession = (token: string, _id: string, role: string) => {
    Cookie.set('auth', JSON.stringify({ token, _id, role }), {
        expires: 30, // 30 days
        path: '/',
    });
};

/**
 * Remove the auth session
 */
export const removeSession = () => {
    Cookie.remove('auth');
};
