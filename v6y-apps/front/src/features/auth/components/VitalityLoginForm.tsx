'use client';

import {
    Button,
    ControlledCheckbox,
    ControlledInput,
    Form,
    Message,
    useForm,
    useTranslationProvider,
} from '@v6y/ui-kit';
import { useEffect } from 'react';

import {
    LoginAccountFormType,
    loginSchemaValidator,
    useAuthentication,
} from '../../../commons/hooks/useAuth';

const VitalityLoginForm = () => {
    const { translate } = useTranslationProvider();
    const [messageApi, contextHolder] = Message.useMessage();
    const { isAuthenticationLoading, authenticationStatus, onAuthentication } =
        useAuthentication(translate);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginAccountFormType>({
        defaultValues: {
            email: '',
            password: '',
            remember: true,
        },
    });

    useEffect(() => {
        if (authenticationStatus?.error) {
            messageApi.open({
                type: 'error',
                content: authenticationStatus.error,
            });
        } else if (authenticationStatus?.token) {
            messageApi.open({
                type: 'success',
                content: translate('vitality.loginPage.formSuccess'),
            });
        }
    }, [authenticationStatus, translate, messageApi]);

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={handleSubmit(onAuthentication)}
            autoComplete="off"
        >
            {contextHolder}

            <Form.Item
                label={translate('vitality.loginPage.formEmail.label')}
                validateStatus={errors.email ? 'error' : ''}
                help={errors.email?.message}
                rules={[
                    {
                        required: true,
                        message: translate('vitality.loginPage.formEmail.warning'),
                    },
                ]}
            >
                <ControlledInput
                    name="email"
                    ariaLabel="Email"
                    control={control}
                    rules={{
                        required: translate('vitality.loginPage.formEmail.warning'),
                        validate: (value: string) => {
                            const result = loginSchemaValidator(translate).safeParse({
                                email: value,
                                password: '',
                            });
                            return (
                                result?.success || result?.error?.format?.()?.email?._errors?.[0]
                            );
                        },
                    }}
                />
            </Form.Item>

            <Form.Item
                label={translate('vitality.loginPage.formPassword.label')}
                validateStatus={errors.password ? 'error' : ''}
                help={errors.password?.message}
                rules={[
                    {
                        required: true,
                        message: translate('vitality.loginPage.formPassword.warning'),
                    },
                ]}
            >
                <ControlledInput
                    name="password"
                    control={control}
                    ariaLabel={translate('vitality.loginPage.formPassword.label')}
                    type="password"
                    rules={{
                        required: translate('vitality.loginPage.formPassword.warning'),
                        validate: (value: string) => {
                            const result = loginSchemaValidator(translate).safeParse({
                                email: '',
                                password: value,
                            });
                            return (
                                result?.success || result?.error?.format?.()?.password?._errors?.[0]
                            );
                        },
                    }}
                />
            </Form.Item>

            <Form.Item name="remember" wrapperCol={{ offset: 8, span: 16 }}>
                <ControlledCheckbox
                    name="remember"
                    control={control}
                    ariaLabel={translate('vitality.loginPage.formRemember')}
                />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={isAuthenticationLoading}>
                    {translate('vitality.loginPage.formSubmit')}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default VitalityLoginForm;
