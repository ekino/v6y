'use client';

import { useForm } from '@v6y/ui-kit';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    TypographyP,
    toast,
    useTranslationProvider,
} from '@v6y/ui-kit-front';
import React, { useEffect } from 'react';

import {
    LoginAccountFormType,
    loginSchemaValidator,
    useAuthentication,
} from '../../../commons/hooks/useAuth';

const VitalityLoginForm = () => {
    const { translate } = useTranslationProvider();
    // plus de state local pour alert
    const { isAuthenticationLoading, authenticationStatus, onAuthentication } =
        useAuthentication(translate);

    const form = useForm<LoginAccountFormType>({
        defaultValues: {
            email: '',
            password: '',
            remember: true,
        },
    });

    useEffect(() => {
        if (authenticationStatus?.error) {
            toast.error(authenticationStatus.error);
        } else if (authenticationStatus?.token) {
            toast.success(translate('vitality.loginPage.formSuccess'));
        }
    }, [authenticationStatus, translate]);

    return (
        <div className="w-full max-w-[400px] sm:max-w-[360px] md:max-w-[340px] lg:max-w-[320px] mx-auto px-4 sm:px-0">
            <Card>
                <CardHeader>
                    <TypographyP muted>
                        If you do not have an account, please refer to your organization.
                    </TypographyP>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onAuthentication)}
                            autoComplete="off"
                            className="space-y-4"
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
                                        <FormLabel>
                                            {translate('vitality.loginPage.formEmail.label')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="email" autoComplete="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
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
                                        <FormLabel>
                                            {translate('vitality.loginPage.formPassword.label')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                autoComplete="current-password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="remember"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    id="remember"
                                                />
                                            </FormControl>
                                            <FormLabel htmlFor="remember" className="ml-2">
                                                {translate('vitality.loginPage.formRemember')}
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <Button size="lg" type="submit" disabled={isAuthenticationLoading}>
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
