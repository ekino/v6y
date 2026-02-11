'use client';

import Image from 'next/image';
import * as React from 'react';

import {
    AdminAuthenticationWrapper,
    Checkbox,
    Form,
    TitleView,
    useTranslationProvider,
} from '@v6y/ui-kit';

export const VitalityAuthLoginView = () => {
    const { translate } = useTranslationProvider();

    return (
        <AdminAuthenticationWrapper
            type="login"
            title={
                <div className="flex flex-col items-center gap-4">
                    <Image
                        width={150}
                        height={40}
                        loading="lazy"
                        src="/vitality_logo.svg"
                        alt="Vitality Logo"
                        className="w-36 h-8 md:w-48 md:h-16"
                    />
                    <p>{translate('v6y-authentication.title')}</p>
                </div>
            }
            rememberMe={
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Custom remember me</Checkbox>
                </Form.Item>
            }
        />
    );
};
