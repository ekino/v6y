'use client';

import { AdminAuthenticationWrapper, TitleView, useTranslationProvider } from '@v6y/ui-kit';
import * as React from 'react';

export const VitalityAuthForgotPasswordView = () => {
    const { translate } = useTranslationProvider();

    return (
        <AdminAuthenticationWrapper
            type="forgotPassword"
            title={<TitleView title={translate('v6y-authentication.title')} />}
        />
    );
};
