'use client';

import { Button, Form, message } from 'antd';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import VitalityCheckbox from '../../../commons/components/form/VitalityCheckbox';
import VitalityInput from '../../../commons/components/form/VitalityInput';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import VitalityTerms from '../../../commons/config/VitalityTerms';
import { buildClientQuery } from '../../../infrastructure/adapters/api/useQueryAdapter';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter';
import { setAuthCookie } from '../../../infrastructure/storage/CookieHelper';
import LoginAccount from '../api/loginAccount';

type FormData = {
    email?: string;
    password?: string;
    remember?: boolean;
};

const emailSchema = z.string().email(VitalityTerms.VITALITY_APP_LOGIN_FORM_EMAIL_WARNING);

const VitalityLoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { router } = useNavigationAdapter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: '',
            remember: true,
        },
    });

    const onSubmit = async (values: FormData) => {
        try {
            emailSchema.parse(values.email);
            const data = (await buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: LoginAccount,
                variables: {
                    input: {
                        email: values.email,
                        password: values.password,
                    },
                },
            })) as { loginAccount?: { token: string; _id: string; role: string } };
            if (data.loginAccount?.token) {
                message.success(VitalityTerms.VITALITY_APP_LOGIN_SUCCESS_MESSAGE);
                setAuthCookie(
                    data.loginAccount.token,
                    data.loginAccount._id,
                    data.loginAccount.role,
                );
                router.push('/');
            } else {
                message.error(VitalityTerms.VITALITY_APP_LOGIN_ERROR_MESSAGE);
            }
        } catch (e) {
            if (e instanceof z.ZodError) {
                message.error(e.errors[0].message);
                return;
            }
            message.error(VitalityTerms.VITALITY_APP_LOGIN_ERROR_CONNECTION_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600, margin: 'auto' }}
            onFinish={handleSubmit(onSubmit)}
            autoComplete="off"
        >
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
                <VitalityInput
                    name="email"
                    control={control}
                    rules={{
                        required: VitalityTerms.VITALITY_APP_LOGIN_FORM_EMAIL_WARNING,
                        validate: (value: string) => {
                            try {
                                emailSchema.parse(value);
                                return true;
                            } catch (e) {
                                if (e instanceof z.ZodError) {
                                    return e.errors[0].message;
                                }
                            }
                        },
                    }}
                    ariaLabel="Email"
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
                <VitalityInput
                    name="password"
                    control={control}
                    rules={{
                        required: VitalityTerms.VITALITY_APP_LOGIN_FORM_PASSWORD_WARNING,
                    }}
                    ariaLabel="Mot de passe"
                    type="password"
                />
            </Form.Item>

            <Form.Item name="remember" wrapperCol={{ offset: 8, span: 16 }}>
                <VitalityCheckbox
                    name="remember"
                    control={control}
                    ariaLabel={VitalityTerms.VITALITY_APP_LOGIN_FORM_REMEMBER_LABEL}
                />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {VitalityTerms.VITALITY_APP_LOGIN_FORM_SUBMIT_LABEL}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default VitalityLoginForm;
