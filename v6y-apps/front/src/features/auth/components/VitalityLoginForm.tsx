'use client';

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
import React, { useEffect } from 'react';

import {
  LoginAccountFormType,
  loginSchemaValidator,
  useAuthentication,
} from '../../../commons/hooks/useAuth';

const VitalityLoginForm = () => {
  const { translate } = useTranslationProvider();
  const { isAuthenticationLoading, authenticationStatus, onAuthentication } =
    useAuthentication(translate);

  const form = useForm<LoginAccountFormType>({
    defaultValues: {
      email: '',
      password: '',
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
    <div className="flex items-center justify-center px-4">
      <Card className="w-full max-w-md border border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl">
            {translate('vitality.loginPage.formTitle')}
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            {translate('vitality.loginPage.formDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onAuthentication)}
              autoComplete="off"
              className="space-y-6"
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
                    <FormLabel className="text-sm font-medium">
                      {translate('vitality.loginPage.formEmail.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-slate-300"
                        placeholder="m@example.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: translate(
                    'vitality.loginPage.formPassword.warning'
                  ),
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
                      <FormLabel className="text-sm font-medium">
                        {translate('vitality.loginPage.formPassword.label')}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        className="border-slate-300"
                        placeholder="●●●●●●"
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                variant="default"
                className="w-full"
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
