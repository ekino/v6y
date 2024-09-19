import dataProvider, { GraphQLClient, graphqlWS, liveProvider } from '@refinedev/graphql';
import Cookies from 'js-cookie';

const dataClient = new GraphQLClient(process.env.NEXT_PUBLIC_GQL_API_BASE_PATH, {
    fetch: (url, options) => {
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                /**
                 * For demo purposes, we're using `localStorage` to access the token.
                 * You can use your own authentication logic here.
                 * In real world applications, you'll need to handle it in sync with your `authProvider`.
                 */
                Authorization: `Bearer ${JSON.parse(Cookies.get('auth'))?.email}`,
            },
        });
    },
});

const wsClient = graphqlWS.createClient({
    url: process.env.NEXT_PUBLIC_GQL_API_BASE_PATH,
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

export const gqlAuthProvider = {
    login: async ({ email, username, password, remember }) => {
        // Suppose we actually send a request to the back end here.
        const user = mockUsers.find((item) => item.email === email);

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
                name: 'LoginError',
                message: 'Invalid username or password',
            },
        };
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
        if (error.response?.status === 401) {
            return {
                logout: true,
            };
        }

        return { error };
    },
};
