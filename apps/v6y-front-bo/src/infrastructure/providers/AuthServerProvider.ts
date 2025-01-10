import { cookies } from 'next/headers';

export const AuthServerProvider = {
    check: async () => {
        const cookieStore = await cookies();
        const auth = cookieStore.get('auth');

        if (auth) {
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            logout: true,
            redirectTo: '/login',
            error: 'Not authenticated',
        };
    },
};
