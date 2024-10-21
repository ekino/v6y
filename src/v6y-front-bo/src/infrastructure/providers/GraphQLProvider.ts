import type { AuthProvider } from '@refinedev/core';
import dataProvider, { GraphQLClient, graphqlWS, liveProvider } from '@refinedev/graphql';
import Cookies from 'js-cookie';

const dataClient = new GraphQLClient(process.env.NEXT_PUBLIC_GQL_API_BASE_PATH as string, {
    fetch: (url: RequestInfo | URL, options?: RequestInit) => {
        return fetch(url, {
            ...options,
            headers: {
                ...(options?.headers || {}),
                Authorization: `Bearer ${JSON.parse(Cookies.get('auth') || '{}')?.token}`,
            },
        });
    },
});

const wsClient = graphqlWS.createClient({
    url: process.env.NEXT_PUBLIC_GQL_API_BASE_PATH as string,
});

export const gqlDataProvider = dataProvider(dataClient);

export const gqlLiveProvider = liveProvider(wsClient);

const mockUsers = [
    {
        email: 'admin@refine.dev',
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        roles: ['admin'],
    },
    {
        email: 'editor@refine.dev',
        name: 'Jane Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        roles: ['editor'],
    },
    {
        email: 'demo@refine.dev',
        name: 'Jane Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        roles: ['user'],
    },
];

export const gqlAuthProvider: AuthProvider = {
    login: async ({ email, password }) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_GQL_API_BASE_PATH;
            if (!apiUrl) {
                throw new Error('NEXT_PUBLIC_GQL_API_BASE_PATH is not defined');
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
                if (data.loginAccount.role !== 'ADMIN') {
                    console.log("You are not authorized to access this page");
                    return {
                        success: false,
                        error: {
                            name: 'LoginError',
                            message: 'You are not authorized to login',
                        },
                    };
                }

                Cookies.set('auth', JSON.stringify({ token: data.loginAccount.token, _id: data.loginAccount._id }), {
                    expires: 30, // 30 jours
                    path: '/',
                });

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
    register: async (params) => {
        // Suppose we actually send a request to the back end here.
        const user = mockUsers.find((item) => item.email === params.email);

        if (user) {
            Cookies.set('auth', JSON.stringify(user), {
                expires: 30, // 30 days
                path: '/',
            });
            return {
                success: true,
                redirectTo: '/',
            };
        }
        return {
            success: false,
            error: {
                message: 'Register failed',
                name: 'Invalid email or password',
            },
        };
    },
    forgotPassword: async (params) => {
        // Suppose we actually send a request to the back end here.
        const user = mockUsers.find((item) => item.email === params.email);

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
    updatePassword: async (params) => {
        // Suppose we actually send a request to the back end here.
        const isPasswordInvalid = params.password === '123456' || !params.password;

        if (isPasswordInvalid) {
            return {
                success: false,
                error: {
                    message: 'Update password failed',
                    name: 'Invalid password',
                },
            };
        }

        return {
            success: true,
        };
    },
    logout: async () => {
        Cookies.remove('auth', { path: '/' });
        return {
            success: true,
            redirectTo: '/login',
        };
    },
    check: async () => {
        const auth = Cookies.get('auth');
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
    getPermissions: async () => {
        const auth = Cookies.get('auth');
        if (auth) {
            const parsedUser = JSON.parse(auth);
            return parsedUser.roles;
        }
        return null;
    },
    getIdentity: async () => {
        const auth = Cookies.get('auth');
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
