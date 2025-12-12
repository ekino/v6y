'use client';

import * as React from 'react';

import { AdminAuthenticationWrapper, TitleView, useTranslationProvider } from '@v6y/ui-kit';

export const VitalityAuthForgotPasswordView = () => {
    const { translate } = useTranslationProvider();

    return (
        <AdminAuthenticationWrapper
            type="forgotPassword"
            title={<TitleView title={translate('v6y-authentication.title')} />}
        />
    );
};
