'use client';

import { AuthPage as AuthPageBase } from '@refinedev/antd';
import { Typography } from 'antd';

import { useTranslation } from '../../infrastructure/adapters/translation/TranslationAdapter';

export const VitalityAuthRegisterView = () => {
    const { translate } = useTranslation();

    return (
        <AuthPageBase
            type="register"
            title={
                <Typography.Title level={2}>
                    {translate('v6y-authentication.title')}
                </Typography.Title>
            }
        />
    );
};
