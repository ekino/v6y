import { signIn, signOut } from 'next-auth/react';

export const RefineAuthProvider = ({ status, data, redirectionUrl }) => ({
    login: async ({ providerName, email, password }) => {
        if (providerName) {
            signIn(providerName, {
                callbackUrl: redirectionUrl?.toString() || '/',
                redirect: true,
            });

            return {
                success: true,
            };
        }

        const signUpResponse = await signIn('CredentialsSignUp', {
            email,
            password,
            callbackUrl: redirectionUrl?.toString() || '/',
            redirect: false,
        });

        if (!signUpResponse) {
            return {
                success: false,
            };
        }

        const { ok, error } = signUpResponse;

        if (ok) {
            return {
                success: true,
                redirectTo: '/',
            };
        }

        return {
            success: false,
            error: new Error(error?.toString()),
        };
    },
    logout: async () => {
        signOut({
            redirect: true,
            callbackUrl: process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL,
        });

        return {
            success: true,
        };
    },
    onError: async (error) => {
        if (error.response?.status === 401) {
            return {
                logout: true,
            };
        }

        return {
            error,
        };
    },
    check: async () => {
        if (status === 'unauthenticated') {
            return {
                authenticated: false,
                redirectTo: process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL,
            };
        }

        return {
            authenticated: true,
        };
    },
    getPermissions: async () => {
        return null;
    },
    getIdentity: async () => {
        if (data?.user) {
            return data?.user;
        }

        return null;
    },
});
