import { useNavigationAdapter } from '@v6y/ui-kit';
import { useState } from 'react';
import { z } from 'zod';

import LoginAccount from '../../features/auth/api/loginAccount';
import { buildClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';
import {
    SessionType,
    getSession,
    removeSession,
    setSession,
} from '../../infrastructure/providers/SessionProvider';
import VitalityApiConfig from '../config/VitalityApiConfig';
import VitalityTerms from '../config/VitalityTerms';

type LoginAccountType = { token: string; _id: string; role: string };

export type LoginAccountFormType = {
    email?: string;
    password?: string;
    remember?: boolean;
};

const loginSchemaValidator = z.object({
    email: z.string().email({ message: VitalityTerms.VITALITY_APP_LOGIN_FORM_EMAIL_WARNING }),
    password: z
        .string()
        .min(8, { message: VitalityTerms.VITALITY_APP_LOGIN_FORM_PASSWORD_WARNING }),
});

const getAuthToken = (): string | undefined => {
    const auth: SessionType | null = getSession();

    return auth?.token;
};

const useLogin = () => {
    const auth: SessionType | null = getSession();

    if (auth) {
        return {
            isLoggedIn: true,
            isLoginLoading: false,
        };
    }

    return {
        isLoggedIn: false,
        isLoginLoading: false,
    };
};

const useLogout = () => {
    const onLogout = () => {
        removeSession();
    };

    return { onLogout };
};

export type AuthenticationStatus = {
    token?: string;
    error?: string;
};

const useAuthentication = () => {
    const [isAuthenticationLoading, setIsAuthenticationLoading] = useState(false);
    const [authenticationStatus, setAuthenticationStatus] = useState<
        AuthenticationStatus | undefined
    >();
    const { router } = useNavigationAdapter();

    const onAuthentication = async (values: LoginAccountFormType) => {
        try {
            setIsAuthenticationLoading(true);

            loginSchemaValidator.safeParse({
                email: values.email,
                password: values.password,
            });

            const data = (await buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: LoginAccount,
                variables: {
                    input: {
                        email: values.email,
                        password: values.password,
                    },
                },
            })) as { loginAccount?: LoginAccountType };

            if (data?.loginAccount?.token) {
                setAuthenticationStatus({ token: data.loginAccount.token, error: undefined });
                setSession(data.loginAccount.token, data.loginAccount._id, data.loginAccount.role);
                router.push('/');
            } else {
                setAuthenticationStatus({
                    token: undefined,
                    error: VitalityTerms.VITALITY_APP_LOGIN_ERROR_MESSAGE,
                });
            }
        } catch (exception) {
            if (exception instanceof z.ZodError) {
                setAuthenticationStatus({
                    token: undefined,
                    error: exception?.errors?.[0]?.message,
                });
            } else {
                setAuthenticationStatus({
                    token: undefined,
                    error: VitalityTerms.VITALITY_APP_LOGIN_ERROR_CONNECTION_MESSAGE,
                });
            }
        } finally {
            setIsAuthenticationLoading(false);
        }
    };

    return {
        onAuthentication,
        isAuthenticationLoading,
        authenticationStatus,
    };
};

export { useAuthentication, useLogin, useLogout, getAuthToken, loginSchemaValidator };
