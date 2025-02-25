'use client';

import {
    AdminAuthenticationWrapper,
    Checkbox,
    Form,
    VitalityTitle,
    useTranslationProvider,
} from '@v6y/shared-ui';
import * as React from 'react';

export const VitalityAuthLoginView = () => {
    const { translate } = useTranslationProvider();

    return (
        <AdminAuthenticationWrapper
            type="login"
            title={<VitalityTitle title={translate('v6y-authentication.title')} />}
            rememberMe={
                <div
                    style={{
                        border: '1px dashed cornflowerblue',
                        padding: 3,
                    }}
                >
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Custom remember me</Checkbox>
                    </Form.Item>
                </div>
            }
        />
    );
};
