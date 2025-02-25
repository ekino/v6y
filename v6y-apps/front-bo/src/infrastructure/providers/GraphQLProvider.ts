import { Client, fetchExchange } from '@urql/core';
import { AdminAuthProviderType, createDataProvider, createLiveProvider } from '@v6y/shared-ui';
import { createClient } from 'graphql-ws';
import Cookie from 'js-cookie';

const wsClient = createClient({
    url: process.env.NEXT_PUBLIC_V6Y_BFF_PATH as string,
});

export const gqlLiveProvider = createLiveProvider(wsClient);

const gqlClient = new Client({
    url: process.env.NEXT_PUBLIC_V6Y_BFF_PATH as string,
    exchanges: [fetchExchange],
});

export const gqlDataProvider = createDataProvider(gqlClient);

export const gqlAuthProvider: AdminAuthProviderType = {
    check: async () => {
        const auth = Cookie.get('auth');
        if (auth) {
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            logout: true,
            redirectTo: '/login',
        };
    },
    login: async ({ email, password }) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_V6Y_BFF_PATH;
            if (!apiUrl) {
                throw new Error('An error was occurred when loading env variables');
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                    variables: {
                        input: { email, password },
                    },
                }),
            });

            const { data, errors } = await response.json();

            if (errors) {
                return {
                    success: false,
                    error: {
                        name: 'LoginError',
                        message: errors[0].message,
                    },
                };
            }

            if (data.loginAccount?.token) {
                if (data.loginAccount.role !== 'ADMIN' && data.loginAccount.role !== 'SUPERADMIN') {
                    return {
                        success: false,
                        error: {
                            name: 'LoginError',
                            message: 'You are not authorized to login',
                        },
                    };
                }

                Cookie.set(
                    'auth',
                    JSON.stringify({
                        token: data.loginAccount.token,
                        _id: data.loginAccount._id,
                        role: data.loginAccount.role,
                    }),
                    {
                        expires: 30, // 30 jours
                        path: '/',
                    },
                );

                return {
                    success: true,
                    redirectTo: '/',
                };
            }

            return {
                success: false,
                error: {
                    name: 'LoginError',
                    message: 'Invalid username or password',
                },
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    name: 'LoginError',
                    message: (error as Error).message,
                },
            };
        }
    },
    forgotPassword: async () => {
        // Suppose we actually send a request to the back end here.
        const user = null;

        if (user) {
            //we can send email with reset password link here
            return {
                success: true,
            };
        }
        return {
            success: false,
            error: {
                message: 'Forgot password failed',
                name: 'Invalid email',
            },
        };
    },
    updatePassword: async ({ password }) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_V6Y_BFF_PATH;
            if (!apiUrl) {
                throw new Error('An error was occurred when loading env variables');
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(Cookie.get('auth') || '{}')?.token}`,
                },
                body: JSON.stringify({
                    operationName: 'UpdateAccountPassword',
                    query: `
                        mutation UpdateAccountPassword($input: AccountUpdatePasswordInput!) {
                            updateAccountPassword(input: $input) {
                                _id
                            }
                        }
                    `,
                    variables: {
                        input: {
                            _id: JSON.parse(Cookie.get('auth') || '{}')?._id,
                            password: password,
                        },
                    },
                }),
            });

            const { data, errors } = await response.json();

            if (errors) {
                return {
                    success: false,
                    error: {
                        name: 'UpdateAccountPassword',
                        message: errors[0].message,
                    },
                };
            }

            if (data.updateAccountPassword) {
                return {
                    success: true,
                };
            }

            return {
                success: false,
                error: {
                    name: 'UpdateAccountPassword',
                    message: 'Invalid password',
                },
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    name: 'UpdateAccountPassword',
                    message: (error as Error).message,
                },
            };
        }
    },
    logout: async () => {
        Cookie.remove('auth', { path: '/' });
        return {
            success: true,
            redirectTo: '/login',
        };
    },
    getPermissions: async () => {
        const auth = Cookie.get('auth');
        if (auth) {
            const parsedUser = JSON.parse(auth);
            return parsedUser.role;
        }
        return null;
    },
    getIdentity: async () => {
        const auth = Cookie.get('auth');
        if (auth) {
            return JSON.parse(auth);
        }
        return null;
    },
    onError: async (error) => {
        if (error?.response?.status === 401) {
            return {
                logout: true,
            };
        }

        return { error };
    },
};
