'use client';

import { AuthPage as AuthPageBase } from '@refinedev/antd';
import { VitalityTitle } from '@v6y/shared-ui';
import { Checkbox, Form } from 'antd';
import * as React from 'react';

export const VitalityAuthLoginView = () => {
    return (
        <AuthPageBase
            type="login"
            title={<VitalityTitle title="v6y-authentication.title" />}
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
