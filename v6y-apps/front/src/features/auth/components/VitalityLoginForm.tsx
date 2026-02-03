'use client';

import React, { useEffect, useRef } from 'react';

import { useForm } from '@v6y/ui-kit';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    toast,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import {
    LoginAccountFormType,
    loginSchemaValidator,
    useAuthentication,
} from '../../../commons/hooks/useAuth';

const VitalityLoginForm = () => {
    const { translate } = useTranslationProvider();
    const { isAuthenticationLoading, authenticationStatus, onAuthentication } =
        useAuthentication(translate);

    const toastShownRef = useRef<string | null>(null);

    const form = useForm<LoginAccountFormType>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        if (authenticationStatus?.error && toastShownRef.current !== authenticationStatus.error) {
            toastShownRef.current = authenticationStatus.error;
            toast.error(authenticationStatus.error);
        } else if (
            authenticationStatus?.token &&
            toastShownRef.current !== authenticationStatus.token
        ) {
            toastShownRef.current = authenticationStatus.token;
            toast.success(translate('vitality.loginPage.formSuccess'));
        }
    }, [authenticationStatus, translate]);

    return (
        <div className="w-full flex items-center justify-center">
            <Card className="w-full max-w-sm md:max-w-md border border-slate-200">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold">
                        {translate('vitality.loginPage.formTitle')}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm md:text-base text-slate-500 mt-2">
                        {translate('vitality.loginPage.formDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onAuthentication)}
                            autoComplete="off"
                            className="space-y-4 sm:space-y-5 md:space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                rules={{
                                    required: translate('vitality.loginPage.formEmail.warning'),
                                    validate: (value: string | undefined) => {
                                        const result = loginSchemaValidator(translate).safeParse({
                                            email: value ?? '',
                                            password: '',
                                        });
                                        return (
                                            result?.success ||
                                            result?.error?.format?.()?.email?._errors?.[0]
                                        );
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm font-medium">
                                            {translate('vitality.loginPage.formEmail.label')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="border-slate-300 text-sm sm:text-base h-10 sm:h-11 focus:ring-2"
                                                placeholder="m@example.com"
                                                type="email"
                                                autoComplete="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs sm:text-sm" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                rules={{
                                    required: translate('vitality.loginPage.formPassword.warning'),
                                    validate: (value: string | undefined) => {
                                        const result = loginSchemaValidator(translate).safeParse({
                                            email: '',
                                            password: value ?? '',
                                        });
                                        return (
                                            result?.success ||
                                            result?.error?.format?.()?.password?._errors?.[0]
                                        );
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel className="text-xs sm:text-sm font-medium">
                                                {translate('vitality.loginPage.formPassword.label')}
                                            </FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input
                                                className="border-slate-300 text-sm sm:text-base h-10 sm:h-11 focus:ring-2"
                                                placeholder="●●●●●●"
                                                type="password"
                                                autoComplete="current-password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs sm:text-sm" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                variant="default"
                                className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base font-medium mt-2"
                                type="submit"
                                disabled={isAuthenticationLoading}
                            >
                                {translate('vitality.loginPage.formSubmit')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default VitalityLoginForm;
