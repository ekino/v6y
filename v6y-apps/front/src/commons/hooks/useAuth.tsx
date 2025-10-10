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

export type LoginAccountType = { token: string; _id: string; role: string; username: string };

export type LoginAccountFormType = {
    email?: string;
    password?: string;
};

export type AuthenticationStatusType = {
    token?: string;
    error?: string;
};

const loginSchemaValidator = (translate: (key: string) => string) => {
    return z.object({
        email: z.string().email({ message: translate('vitality.loginPage.formEmail.warning') }),
        password: z
            .string()
            .min(8, { message: translate('vitality.loginPage.formPassword.warning') }),
    });
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

const useAuthentication = (translate: (key: string) => string) => {
    const [isAuthenticationLoading, setIsAuthenticationLoading] = useState(false);
    const [authenticationStatus, setAuthenticationStatus] = useState<
        AuthenticationStatusType | undefined
    >();
    const { router } = useNavigationAdapter();

    const onAuthentication = async (values: LoginAccountFormType) => {
        try {
            setIsAuthenticationLoading(true);

            loginSchemaValidator(translate).safeParse({
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
                setSession(
                    data.loginAccount.token,
                    data.loginAccount._id,
                    data.loginAccount.role,
                    data.loginAccount.username,
                );
                router.push('/');
            } else {
                setAuthenticationStatus({
                    token: undefined,
                    error: translate('vitality.loginPage.formErrorIncorrectCreds'),
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
                    error: translate('vitality.loginPage.formErrorConnection'),
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

export { useAuthentication, useLogin, useLogout, loginSchemaValidator };
