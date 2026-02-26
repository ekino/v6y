'use client';

import Image from 'next/image';
import * as React from 'react';

import { AdminAuthenticationWrapper, Checkbox, Form, useTranslationProvider } from '@v6y/ui-kit';

const VitalityAuthLoginView = () => {
    const { translate } = useTranslationProvider();

    return (
        <AdminAuthenticationWrapper
            type="login"
            title={
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                    }}
                >
                    <Image
                        width={150}
                        height={40}
                        loading="lazy"
                        src="/vitality_logo.svg"
                        alt="Vitality Logo"
                        className="vitality-logo"
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

export default VitalityAuthLoginView;
