'use client';

import { AuthPage as AuthPageBase } from '@refinedev/antd';
import { Checkbox, Form, Typography } from 'antd';

import { useTranslation } from '../../infrastructure/adapters/translation/TranslationAdapter.js';


export const VitalityAuthLoginView = () => {
    const { translate } = useTranslation();

    return (
        <AuthPageBase
            type="login"
            title={
                <Typography.Title level={2}>
                    {translate('v6y-authentication.title')}
                </Typography.Title>
            }
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
