'use client';

import * as React from 'react';

import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import AdminAuthenticationWrapper from '@v6y/ui-kit/components/pages/admin/AdminAuthenticationWrapper';
import useTranslationProvider from '@v6y/ui-kit/translation/useTranslationProvider';

export const VitalityAuthForgotPasswordView = () => {
    const { translate } = useTranslationProvider();

    return (
        <AdminAuthenticationWrapper
            type="forgotPassword"
            title={<TitleView title={translate('v6y-authentication.title')} />}
        />
    );
};
