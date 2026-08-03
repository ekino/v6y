'use client';

import Cookie from 'js-cookie';

/**
 * authProvider for ra-core.
 * Mirrors the JWT + cookie flow used by the old front-bo app's GraphQLProvider:
 * a successful `LoginAccount` GraphQL call stores `{ token, _id, role }` in a
 * 30-day `auth` cookie, and every subsequent dataProvider call sends the token
 * as an `Authorization: Bearer` header (see graphqlClient.ts).
 */

interface LoginParams {
    email?: string;
    username?: string;
    password: string;
}

const ALLOWED_ROLES = ['ADMIN', 'SUPERADMIN'];

export const authProvider = {
    login: async ({ email, password }: LoginParams) => {
        const apiUrl = process.env.NEXT_PUBLIC_V6Y_BFF_PATH;
        if (!apiUrl) {
            throw new Error('NEXT_PUBLIC_V6Y_BFF_PATH env variable is not set');
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operationName: 'LoginAccount',
                query: `
                    query LoginAccount($input: AccountLoginInput!) {
                        loginAccount(input: $input) {
                            _id
                            role
                            token
                        }
                    }
                `,
                variables: { input: { email, password } },
            }),
        });

        const { data, errors } = await response.json();

        if (errors?.length) {
            throw new Error(errors[0].message);
        }

        if (!data?.loginAccount?.token) {
            throw new Error('Invalid username or password');
        }

        if (!ALLOWED_ROLES.includes(data.loginAccount.role)) {
            throw new Error('You are not authorized to access the back office');
        }

        Cookie.set(
            'auth',
            JSON.stringify({
                token: data.loginAccount.token,
                _id: data.loginAccount._id,
                role: data.loginAccount.role,
            }),
            { expires: 30, path: '/' },
        );
    },

    logout: async () => {
        Cookie.remove('auth', { path: '/' });
    },

    checkAuth: async () => {
        if (!Cookie.get('auth')) {
            throw new Error('Not authenticated');
        }
    },

    checkError: async (error: { status?: number; message?: string }) => {
        const isAuthError =
            error?.status === 401 ||
            (typeof error?.message === 'string' && error.message.includes('Unauthorized'));

        if (isAuthError) {
            Cookie.remove('auth', { path: '/' });
            throw new Error('Session expired');
        }
    },

    getIdentity: async () => {
        const raw = Cookie.get('auth');
        if (!raw) {
            throw new Error('Not authenticated');
        }
        const auth = JSON.parse(raw) as { _id: number | string; role: string };
        return { id: auth._id, fullName: auth.role };
    },
};

export default authProvider;
