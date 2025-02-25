'use client';

import { AdminAuthenticationWrapper, VitalityTitle, useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

export const VitalityAuthForgotPasswordView = () => {
    const { translate } = useTranslationProvider();

    return (
        <AdminAuthenticationWrapper
            type="forgotPassword"
            title={<VitalityTitle title={translate('v6y-authentication.title')} />}
        />
    );
};
