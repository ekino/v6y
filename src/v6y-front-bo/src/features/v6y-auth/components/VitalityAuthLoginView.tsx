'use client';

import { AuthPage as AuthPageBase } from '@refinedev/antd';
import { Typography } from 'antd';

import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';

export const VitalityAuthLoginView = () => {
    const { translate } = useTranslation();

    return (
        <AuthPageBase
            type="login"
            rememberMe={false}
            forgotPasswordLink={false}
            registerLink={false}
            title={
                <Typography.Title level={2}>
                    {translate('v6y-authentication.title')}
                </Typography.Title>
            }
        />

    );
};
