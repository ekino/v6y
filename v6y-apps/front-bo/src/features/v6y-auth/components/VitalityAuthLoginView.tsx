'use client';

import {
    AdminAuthenticationWrapper,
    Checkbox,
    Form,
    TitleView,
    useTranslationProvider,
} from '@v6y/ui-kit';
import * as React from 'react';

export const VitalityAuthLoginView = () => {
    const { translate } = useTranslationProvider();

    return (
        <AdminAuthenticationWrapper
            type="login"
            title={<TitleView title={translate('v6y-authentication.title')} />}
            rememberMe={
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Custom remember me</Checkbox>
                </Form.Item>
            }
        />
    );
};
