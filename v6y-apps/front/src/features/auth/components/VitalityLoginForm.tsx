'use client';

import { Button, ControlledCheckbox, ControlledInput, Form, Message, useForm } from '@v6y/ui-kit';
import { useEffect } from 'react';

import VitalityTerms from '../../../commons/config/VitalityTerms';
import {
    LoginAccountFormType,
    loginSchemaValidator,
    useAuthentication,
} from '../../../commons/hooks/useAuth';

const VitalityLoginForm = () => {
    const [messageApi, contextHolder] = Message.useMessage();
    const { isAuthenticationLoading, authenticationError, onAuthentication } = useAuthentication();

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
        if (authenticationError) {
            messageApi.open({
                type: 'error',
                content: authenticationError,
            });
        } else {
            messageApi.open({
                type: 'success',
                content: VitalityTerms.VITALITY_APP_LOGIN_SUCCESS_MESSAGE,
            });
        }
    }, [authenticationError]);

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
                label={VitalityTerms.VITALITY_APP_LOGIN_FORM_EMAIL_LABEL}
                validateStatus={errors.email ? 'error' : ''}
                help={errors.email?.message}
                rules={[
                    {
                        required: true,
                        message: VitalityTerms.VITALITY_APP_LOGIN_FORM_EMAIL_WARNING,
                    },
                ]}
            >
                <ControlledInput
                    name="email"
                    ariaLabel="Email"
                    control={control}
                    rules={{
                        required: VitalityTerms.VITALITY_APP_LOGIN_FORM_EMAIL_WARNING,
                        validate: (value: string) => {
                            const result = loginSchemaValidator.safeParse({
                                email: value,
                                password: '',
                            });
                            return result?.success
                                ? true
                                : result?.error?.format?.()?.email?._errors?.[0];
                        },
                    }}
                />
            </Form.Item>

            <Form.Item
                label={VitalityTerms.VITALITY_APP_LOGIN_FORM_PASSWORD_LABEL}
                validateStatus={errors.password ? 'error' : ''}
                help={errors.password?.message}
                rules={[
                    {
                        required: true,
                        message: VitalityTerms.VITALITY_APP_LOGIN_FORM_PASSWORD_WARNING,
                    },
                ]}
            >
                <ControlledInput
                    name="password"
                    control={control}
                    ariaLabel={VitalityTerms.VITALITY_APP_LOGIN_FORM_PASSWORD_LABEL}
                    type="password"
                    rules={{
                        required: VitalityTerms.VITALITY_APP_LOGIN_FORM_PASSWORD_WARNING,
                        validate: (value: string) => {
                            const result = loginSchemaValidator.safeParse({
                                email: '',
                                password: value,
                            });
                            return result?.success
                                ? true
                                : result?.error?.format?.()?.password?._errors?.[0];
                        },
                    }}
                />
            </Form.Item>

            <Form.Item name="remember" wrapperCol={{ offset: 8, span: 16 }}>
                <ControlledCheckbox
                    name="remember"
                    control={control}
                    ariaLabel={VitalityTerms.VITALITY_APP_LOGIN_FORM_REMEMBER_LABEL}
                />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={isAuthenticationLoading}>
                    {VitalityTerms.VITALITY_APP_LOGIN_FORM_SUBMIT_LABEL}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default VitalityLoginForm;
