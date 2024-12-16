'use client';

import { Button, Checkbox, Form, Input, message } from 'antd';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import { buildClientQuery } from '../../../infrastructure/adapters/api/useQueryAdapter';
import LoginAccount from '../api/loginAccount';

type FormData = {
    email?: string;
    password?: string;
    remember?: boolean;
};

const VitalityLoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);

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
            setIsLoading(true);
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
                message.success('Connexion réussie');
                Cookies.set(
                    'auth',
                    JSON.stringify({
                        token: data.loginAccount.token,
                        _id: data.loginAccount._id,
                        role: data.loginAccount.role,
                    }),
                    {
                        expires: 30, // 30 jours
                        path: '/',
                    },
                );

                window.location.href = '/';
            } else {
                message.error('Identifiants incorrects');
            }
        } catch {
            message.error('Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <Form.Item
                label="Email"
                validateStatus={errors.email ? 'error' : ''}
                help={errors.email?.message}
                rules={[{ required: true, message: 'Veuillez saisir votre email !' }]}
            >
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: 'Veuillez saisir votre email !',
                        validate: (value) => {
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            return value && emailRegex.test(value)
                                ? true
                                : 'Veuillez saisir un email valide !';
                        },
                    }}
                    render={({ field }) => <Input {...field} aria-label="Email" />}
                />
            </Form.Item>

            <Form.Item
                label="Mot de passe"
                validateStatus={errors.password ? 'error' : ''}
                help={errors.password?.message}
                rules={[{ required: true, message: 'Veuillez saisir votre mot de passe !' }]}
            >
                <Controller
                    name="password"
                    control={control}
                    rules={{
                        required: 'Veuillez saisir votre mot de passe !',
                    }}
                    render={({ field }) => <Input.Password {...field} aria-label="Mot de passe" />}
                />
            </Form.Item>

            <Form.Item name="remember" wrapperCol={{ offset: 8, span: 16 }}>
                <Controller
                    name="remember"
                    control={control}
                    render={({ field: { value, ...field } }) => (
                        <Checkbox {...field} checked={value}>
                            Se souvenir de moi
                        </Checkbox>
                    )}
                />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Connexion
                </Button>
            </Form.Item>
        </Form>
    );
};

export default VitalityLoginForm;
