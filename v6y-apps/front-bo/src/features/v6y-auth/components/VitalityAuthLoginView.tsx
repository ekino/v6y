'use client';

import * as React from 'react';

import Checkbox from '@v6y/ui-kit/components/atoms/app/Checkbox';
import Form from '@v6y/ui-kit/components/atoms/app/Form';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import AdminAuthenticationWrapper from '@v6y/ui-kit/components/pages/admin/AdminAuthenticationWrapper';
import useTranslationProvider from '@v6y/ui-kit/translation/useTranslationProvider';

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
