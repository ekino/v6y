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
            <Card className="w-full max-w-sm overflow-hidden border-slate-200 shadow-[0_1px_0_rgba(27,31,36,0.04),0_16px_40px_rgba(140,149,159,0.16)] md:max-w-lg">
                <CardHeader className="border-b border-slate-200 bg-white pb-5">
                    <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        {translate('vitality.loginPage.formTitle')}
                    </CardTitle>
                    <CardDescription className="mt-2 max-w-[32rem] text-sm leading-7 text-slate-600 md:text-base">
                        {translate('vitality.loginPage.formDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-5 md:p-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onAuthentication)}
                            autoComplete="off"
                            className="space-y-5 md:space-y-6"
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
                                        <FormLabel className="text-sm font-medium text-slate-700">
                                            {translate('vitality.loginPage.formEmail.label')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-11 rounded-lg border-slate-300 bg-white text-sm sm:text-base focus:ring-2"
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
                                            <FormLabel className="text-sm font-medium text-slate-700">
                                                {translate('vitality.loginPage.formPassword.label')}
                                            </FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input
                                                className="h-11 rounded-lg border-slate-300 bg-white text-sm sm:text-base focus:ring-2"
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
                                className="mt-2 h-11 w-full rounded-full bg-slate-950 text-sm font-medium text-white hover:bg-slate-800 sm:text-base md:h-12"
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
